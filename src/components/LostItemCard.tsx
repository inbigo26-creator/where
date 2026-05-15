import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Trash2, CheckCircle, Info, Lock, ImageOff, MapPin, User as UserIcon, X, ZoomIn, Eye } from 'lucide-react';
import { LostItem, UserRole } from '../types';
import { lostItemsService } from '../services/lostItemsService';
import PasswordModal from './PasswordModal';

interface LostItemCardProps {
  key?: string;
  item: LostItem;
  userRole?: UserRole;
  onCollect: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export default function LostItemCard({ item, userRole, onCollect, onDelete }: LostItemCardProps) {
  const isTeacher = userRole === UserRole.TEACHER;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [passModal, setPassModal] = useState<{ isOpen: boolean; title: string; onConfirm: () => void } | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-brand-secondary/40 transition-all cursor-pointer group"
        onClick={() => item.photoUrl && setIsPreviewOpen(true)}
      >
        {/* Image Container */}
        <div className="w-full sm:w-40 h-48 sm:h-40 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 group-hover:border-brand-secondary/30 transition-all relative">
          {item.photoUrl ? (
            <>
              <img 
                src={item.photoUrl} 
                alt={item.name} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-text/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ZoomIn className="text-brand-text/60" size={20} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
              <ImageOff size={32} strokeWidth={1} />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">사진 없음</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur text-brand-text text-[9px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
              {item.status === 'available' ? '보관 중' : '수령 완료'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-brand-text tracking-tight">{item.name}</h3>
              {isTeacher && (
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setPassModal({
                        isOpen: true,
                        title: '수령 완료 처리',
                        onConfirm: () => {
                          if (confirm('이 물품을 수령 완료 처리하시겠습니까?')) {
                            onCollect(item.id);
                          }
                          setPassModal(null);
                        }
                      });
                    }}
                    className="p-2 bg-brand-accent text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all border border-brand-secondary/20"
                    title="수령 완료"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setPassModal({
                        isOpen: true,
                        title: '물품 삭제',
                        onConfirm: () => {
                          if (confirm('정말 삭제하시겠습니까?')) {
                            onDelete(item.id);
                          }
                          setPassModal(null);
                        }
                      });
                    }}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-100"
                    title="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                <Calendar size={14} className="text-brand-secondary" />
                <span>{new Date(item.dateFound).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary">
                <MapPin size={14} className="opacity-70" />
                <span>{item.location}</span>
              </div>
              {item.teacherName && (
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-secondary">
                  <UserIcon size={14} className="opacity-70" />
                  <span>담당: {item.teacherName} 선생님</span>
                </div>
              )}
            </div>
            <p className="text-sm text-brand-muted mt-3 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>

          {/* Footer Info */}
          <div className="mt-5 pt-4 border-t border-slate-50">
            {isTeacher ? (
              <div className="flex items-start gap-3 p-3 bg-brand-accent/40 rounded-xl border border-brand-secondary/20">
                <Info size={16} className="text-brand-primary shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-brand-text leading-relaxed">
                  물건을 찾으러 오는 학생에게 습득 장소나 물건의 특징 등 주인을 확인할 수 있는 질문을 해주세요.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                <Info size={16} className="text-brand-secondary shrink-0" />
                <p>물건 수령 시 상세 특징 확인 절차가 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && item.photoUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-brand-text/90 backdrop-blur-sm shadow-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-0 right-0 p-4 text-white hover:text-brand-accent transition-colors"
              >
                <X size={40} />
              </button>
              <img 
                src={item.photoUrl} 
                alt={item.name} 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-bold">{item.name}</h3>
                <p className="mt-2 text-white/60 font-semibold">{item.location}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {passModal && (
        <PasswordModal
          isOpen={passModal.isOpen}
          onClose={() => setPassModal(null)}
          onConfirm={passModal.onConfirm}
          title={passModal.title}
        />
      )}
    </>
  );
}
