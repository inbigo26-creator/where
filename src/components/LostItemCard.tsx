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
  const [privateNote, setPrivateNote] = useState<string | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [passModal, setPassModal] = useState<{ isOpen: boolean; title: string; onConfirm: () => void } | null>(null);
  const [showPrivateNote, setShowPrivateNote] = useState(false);

  useEffect(() => {
    if (isTeacher && showPrivateNote) {
      setLoadingNote(true);
      lostItemsService.getPrivateNote(item.id).then(note => {
        setPrivateNote(note);
        setLoadingNote(false);
      });
    }
  }, [item.id, isTeacher, showPrivateNote]);

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

          {/* Verification Note */}
          <div className="mt-5 pt-4 border-t border-slate-50">
            {isTeacher ? (
              <div className="flex items-center gap-3">
                {!showPrivateNote ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPassModal({
                        isOpen: true,
                        title: '본인 확인 메모 확인',
                        onConfirm: () => {
                          setShowPrivateNote(true);
                          setPassModal(null);
                        }
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10 rounded-xl border border-brand-primary/10 text-xs font-bold transition-all"
                  >
                    <Eye size={14} />
                    본인 확인용 메모 보기
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 w-full animate-in fade-in slide-in-from-left-2 transition-all">
                    <Lock size={14} className="text-brand-primary shrink-0" />
                    {loadingNote ? (
                      <div className="h-4 w-32 bg-white animate-pulse rounded"></div>
                    ) : (
                      <span className="text-sm font-bold text-brand-primary">
                        본인 확인용: {privateNote || '내용 없음'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                <Info size={16} className="text-brand-secondary shrink-0" />
                <p>교무실 방문 시 상세 특징 답변 필요</p>
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
