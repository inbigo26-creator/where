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
    if (isTeacherMode) {
      setIsUploadOpen(true);
    } else {
      const password = prompt('물품을 등록하려면 선생님 비밀번호를 입력하세요.');
      if (password === '1004') {
        setIsTeacherMode(true);
        localStorage.setItem('isTeacherMode', 'true');
        setIsUploadOpen(true);
      } else if (password !== null) {
        alert('비밀번호가 틀렸습니다.');
      }
    }
  };

  const handleUpload = async (data: any) => {
    await lostItemsService.createItem(data);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header 
        isTeacher={isTeacherMode}
        onOpenUpload={handleUploadClick}
        onToggleTeacher={handleToggleTeacherMode}
        itemCount={availableCount}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Sidebar / Info Panel (Desktop) */}
        <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-6 sm:p-8 flex flex-col gap-8 shrink-0 overflow-y-auto lg:h-full">
          <div>
            <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">메뉴</div>
            <div className="space-y-2">
              <button className="flex items-center gap-4 w-full p-5 bg-[#b8d8b0] text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-green-100">
                <PackageSearch size={20} />
                전체 분실물 보기
              </button>
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-4 w-full p-5 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-base transition-all"
              >
                <PlusCircle size={20} />
                물품 등록 (교사용)
              </button>
            </div>
          </div>

          <div className="p-8 bg-[#9dc093] text-white rounded-[40px] relative overflow-hidden shadow-xl shadow-green-100/50">
            <div className="relative z-10">
              <h3 className="text-xs uppercase tracking-[0.2em] text-green-50 font-black mb-6">안내 가이드</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-white text-[#9dc093] flex items-center justify-center font-black text-xs shrink-0">01</div>
                  <p className="text-sm font-bold leading-tight">목록에서 본인 물건 확인</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-white text-[#9dc093] flex items-center justify-center font-black text-xs shrink-0">02</div>
                  <p className="text-sm font-bold leading-tight">보관 장소로 교무실 방문</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-white text-[#9dc093] flex items-center justify-center font-black text-xs shrink-0">03</div>
                  <div>
                    <p className="text-sm font-bold leading-tight">상세 특징 질문 답변</p>
                    <p className="text-[11px] text-green-50 mt-1.5 opacity-80 font-bold italic">"주인만 아는 세부 특징 설명"</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
          </div>

          <div className="p-6 bg-slate-50/80 rounded-[32px] border border-slate-200/60 lg:mt-auto">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Clock size={12} />
              최근 알림
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4 pr-2">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0 animate-pulse"></div>
                <p className="text-sm text-slate-600 leading-normal font-bold">분실물 습득 시 즉시 등록 바랍니다.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 h-full">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="물건 이름이나 보관 장소로 검색..."
                className="w-full bg-white border border-slate-200/80 rounded-2xl py-5 pl-16 pr-8 focus:ring-4 focus:ring-green-400/5 focus:border-green-300 transition-all shadow-md text-base sm:text-lg outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-8 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-full md:w-auto px-2 justify-center">
              <span className="text-green-500 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-green-500">최신 등록순</span>
              <span className="hover:text-slate-700 cursor-pointer transition-colors">보관 장소별</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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
              className="flex flex-col items-center justify-center py-24 sm:py-32 text-center"
            >
              <div className="text-slate-200 mb-6">
                <PackageSearch size={64} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold text-slate-400">주인님을 기다리는 물건이 없어요</h3>
              <p className="text-slate-300 text-sm mt-3 uppercase tracking-widest font-black">All items returned or none found</p>
            </motion.div>
          )}

          {/* Bottom Spacer for Mobile FAB */}
          <div className="h-20 lg:hidden"></div>
        </section>

        {/* Floating Action Button (Mobile Teacher) */}
        {isTeacherMode && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleUploadClick}
            className="fixed bottom-20 right-6 lg:hidden w-14 h-14 bg-[#9dc093] text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-300 z-30"
          >
            <PlusCircle size={28} />
          </motion.button>
        )}
      </main>

      {/* Footer Bar */}
      <footer className="h-16 bg-white border-t border-slate-200 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>School Integrity & Retrieval Office</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span>Version 1.0.0 (2026) © INBIGO. All Rights Reserved.</span>
          <span className="hidden sm:inline border-l border-slate-200 h-3"></span>
          <span className="text-green-500">System Stable</span>
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
