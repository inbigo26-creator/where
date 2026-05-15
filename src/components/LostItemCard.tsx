import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Trash2, CheckCircle, Info, Lock, ImageOff } from 'lucide-react';
import { LostItem, ItemStatus, UserRole } from '../types';
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
      className="bg-white rounded-3xl border border-green-50 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-5 hover:border-green-200 transition-all cursor-pointer group"
    >
      {/* Image Container */}
      <div className="w-full sm:w-32 h-40 sm:h-32 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all relative">
        {item.photoUrl ? (
          <img 
            src={item.photoUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
            <ImageOff size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">No Photo</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur text-slate-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
            {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-900 leading-snug">{item.name}</h3>
            {isTeacher && (
              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onCollect(item.id); }}
                  className="p-1.5 bg-green-50 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                  title="수령 완료"
                >
                  <CheckCircle size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                  title="삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={12} className="text-slate-400" />
              <span>{new Date(item.dateFound).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <span>{item.location}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>
        </div>

        {/* Verification Note (Mini) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {isTeacher ? (
            <div className="flex items-center gap-2">
              <Lock size={12} className="text-slate-400" />
              {loadingNote ? (
                <div className="h-3 w-32 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <span className="text-[11px] font-medium text-slate-600 italic">
                  질문: {privateNote || '등록된 질문 없음'}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Info size={12} className="text-green-400 shrink-0" />
              <p>방문 시 상세 특징 질문 답변 필요</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
