/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  PackageSearch,
  ChevronDown,
  User as UserIcon,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import Header from './components/Header';
import LostItemCard from './components/LostItemCard';
import UploadModal from './components/UploadModal';
import { authService } from './services/authService';
import { lostItemsService } from './services/lostItemsService';
import { LostItem, UserProfile, UserRole } from './types';

export default function App() {
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [items, setItems] = useState<LostItem[]>([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for teacher mode
    const storedTeacherMode = localStorage.getItem('isTeacherMode') === 'true';
    setIsTeacherMode(storedTeacherMode);

    // Initial load
    setIsLoading(false);

    // 2. Count Listener
    const unsubscribeCount = lostItemsService.subscribeToAvailableCount((count) => {
      setAvailableCount(count);
    });

    // 3. Items Listener
    const unsubscribeItems = lostItemsService.subscribeToItems((items) => {
      setItems(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    return () => {
      unsubscribeCount();
      unsubscribeItems();
    };
  }, []);

  const handleToggleTeacherMode = () => {
    if (isTeacherMode) {
      setIsTeacherMode(false);
      localStorage.setItem('isTeacherMode', 'false');
    } else {
      const password = prompt('관리자(선생님) 비밀번호를 입력하세요.');
      if (password === '1004') {
        setIsTeacherMode(true);
        localStorage.setItem('isTeacherMode', 'true');
        alert('선생님 모드가 활성화되었습니다.');
      } else if (password !== null) {
        alert('비밀번호가 틀렸습니다.');
      }
    }
  };

  const handleUploadClick = () => {
    const password = prompt('물품을 등록하려면 선생님 비밀번호(1004)를 입력하세요.');
    if (password === '1004') {
      if (!isTeacherMode) {
        setIsTeacherMode(true);
        localStorage.setItem('isTeacherMode', 'true');
      }
      setIsUploadOpen(true);
    } else if (password !== null) {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleUpload = async (data: any) => {
    await lostItemsService.createItem(data);
    setIsUploadOpen(false);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7FBE1]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D9ED92]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans selection:bg-brand-secondary selection:text-brand-text">
      <Header 
        isTeacher={isTeacherMode}
        onOpenUpload={handleUploadClick}
        onToggleTeacher={handleToggleTeacherMode}
        itemCount={availableCount}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Sidebar / Info Panel (Desktop) */}
        <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/60 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto lg:h-full">
          <div>
            <div className="mb-4 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <div className="w-1 h-3 bg-brand-primary rounded-full"></div>
              메뉴
            </div>
            <div className="space-y-3">
              <button className="flex items-center gap-3 w-full p-4 bg-brand-primary text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand-primary/20">
                <PackageSearch size={18} />
                전체 분실물 보기
              </button>
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-3 w-full p-4 text-brand-muted hover:bg-brand-accent rounded-xl font-semibold text-sm transition-all border border-transparent"
              >
                <PlusCircle size={18} />
                물품 등록 (교사용)
              </button>
            </div>
          </div>

          <div className="p-6 bg-brand-accent/50 text-brand-text rounded-3xl relative overflow-hidden border border-brand-secondary/30">
            <div className="relative z-10">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-brand-muted font-bold mb-5 italic">분실물 확인 방법</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">01</div>
                  <p className="text-sm font-medium leading-tight">목록에서 본인 물건 확인</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">02</div>
                  <p className="text-sm font-medium leading-tight">보관 장소로 교무실 방문</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">03</div>
                  <div>
                    <p className="text-sm font-medium leading-tight">상세 특징 질문 답변</p>
                    <p className="text-[11px] text-brand-muted mt-1 font-medium italic">"주인만 아는 특징 설명"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 lg:mt-auto">
            <h4 className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Clock size={12} />
              최근 등록 물품 안내
            </h4>
            <div className="space-y-3">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0"></div>
                  <p className="text-xs text-brand-muted leading-relaxed font-medium">
                    <span className="text-brand-text font-bold">{item.name}</span>({item.location})
                  </p>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-[10px] text-brand-muted/60 italic">최근 등록된 물품이 없습니다.</p>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 h-full">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="물건 이름이나 보관 장소 검색..."
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-sm text-base outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-8 text-[11px] font-bold text-brand-muted uppercase tracking-[0.2em] w-full md:w-auto px-2 justify-center">
              <span className="text-brand-primary relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-brand-primary">최신 등록순</span>
              <span className="hover:text-brand-text cursor-pointer transition-colors">보관 장소별</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item: LostItem) => (
                <LostItemCard 
                  key={item.id} 
                  item={item} 
                  userRole={isTeacherMode ? UserRole.TEACHER : UserRole.STUDENT}
                  onCollect={(id) => lostItemsService.collectItem(id)}
                  onDelete={(id) => lostItemsService.deleteItem(id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 bg-white p-10 rounded-full shadow-inner border border-brand-accent relative">
                <PackageSearch size={64} strokeWidth={1} className="text-brand-secondary" />
                <div className="absolute top-2 right-2 w-4 h-4 bg-brand-primary rounded-full animate-ping opacity-20"></div>
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">기다리는 물건이 없어요</h3>
              <p className="text-brand-muted text-sm uppercase tracking-widest font-medium">오늘도 평화로운 학교!</p>
            </motion.div>
          )}

          {/* Bottom Spacer for Mobile FAB */}
          <div className="h-24 lg:hidden"></div>
        </section>

        {/* Floating Action Button (Mobile Teacher) */}
        {isTeacherMode && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleUploadClick}
            className="fixed bottom-24 right-6 lg:hidden w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-brand-primary/30 z-30 border-2 border-white"
          >
            <PlusCircle size={28} />
          </motion.button>
        )}
      </main>

      {/* Footer Bar */}
      <footer className="h-20 bg-white border-t border-slate-100 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between py-4 text-[10px] font-medium text-brand-muted uppercase tracking-[0.2em] shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-primary/40"></div>
          <span>School Integrity & Retrieval Office</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <span>Version 1.0.0 © INBIGO. All Rights Reserved.</span>
          <span className="hidden sm:inline border-l border-slate-200 h-3"></span>
          <span className="text-brand-primary font-bold">System Status: Stable</span>
        </div>
      </footer>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
