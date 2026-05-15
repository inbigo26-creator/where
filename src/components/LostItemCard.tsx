import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Trash2, CheckCircle, Info, Lock, ImageOff, MapPin } from 'lucide-react';
import { LostItem, UserRole } from '../types';
import { lostItemsService } from '../services/lostItemsService';

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

  useEffect(() => {
    if (isTeacher) {
      setLoadingNote(true);
      lostItemsService.getPrivateNote(item.id).then(note => {
        setPrivateNote(note);
        setLoadingNote(false);
      });
    }
  }, [item.id, isTeacher]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-brand-secondary/40 transition-all cursor-pointer group"
    >
      {/* Image Container */}
      <div className="w-full sm:w-40 h-48 sm:h-40 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 group-hover:border-brand-secondary/30 transition-all relative">
        {item.photoUrl ? (
          <img 
            src={item.photoUrl} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
            <ImageOff size={32} strokeWidth={1} />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">No Visual</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur text-brand-text text-[9px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
            {item.status}
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
                  onClick={(e) => { e.stopPropagation(); onCollect(item.id); }}
                  className="p-2 bg-brand-accent text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all border border-brand-secondary/20"
                  title="수령 완료"
                >
                  <CheckCircle size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
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
          </div>
          <p className="text-sm text-brand-muted mt-3 line-clamp-2 leading-relaxed">{item.description}</p>
        </div>

        {/* Verification Note */}
        <div className="mt-5 pt-4 border-t border-slate-50">
          {isTeacher ? (
            <div className="flex items-center gap-3 p-3 bg-brand-accent/30 rounded-xl">
              <Lock size={14} className="text-brand-primary" />
              {loadingNote ? (
                <div className="h-4 w-32 bg-white animate-pulse rounded"></div>
              ) : (
                <span className="text-xs font-semibold text-brand-text italic">
                  확인용: {privateNote || '내용 없음'}
                </span>
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
  );
}
