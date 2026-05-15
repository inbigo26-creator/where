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
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border border-slate-200 shadow-md">
            {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{item.name}</h3>
            {isTeacher && (
              <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onCollect(item.id); }}
                  className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                  title="수령 완료"
                >
                  <CheckCircle size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  title="삭제"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Calendar size={14} className="text-slate-400" />
              <span>{new Date(item.dateFound).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-black text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>{item.location}</span>
            </div>
          </div>
          <p className="text-base text-slate-600 mt-3 font-medium line-clamp-2 leading-relaxed">{item.description}</p>
        </div>

        {/* Verification Note (Mini) */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          {isTeacher ? (
            <div className="flex items-center gap-3">
              <Lock size={14} className="text-slate-400" />
              {loadingNote ? (
                <div className="h-4 w-40 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <span className="text-sm font-bold text-slate-700 italic">
                  본인 확인 질문: {privateNote || '등록된 내용 없음'}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest">
              <Info size={16} className="text-green-500 shrink-0" />
              <p>교무실 방문 시 상세 특징 질문 답변 필요</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
