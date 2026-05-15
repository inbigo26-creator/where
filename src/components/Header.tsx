import { motion } from 'motion/react';
import { PackageSearch, PlusCircle, LogIn, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  isTeacher: boolean;
  onOpenUpload: () => void;
  onToggleTeacher: () => void;
  itemCount: number;
}

export default function Header({ 
  isTeacher, 
  onOpenUpload,
  onToggleTeacher,
  itemCount 
}: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 md:px-10 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary shrink-0">
          <PackageSearch className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-brand-text tracking-tight leading-none mb-1 truncate">주인님 어디 계세요</h1>
          <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-brand-muted uppercase tracking-wider truncate">인비고 분실물 관리 시스템</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex bg-brand-accent/40 border border-brand-secondary/30 rounded-2xl px-6 py-3 items-center gap-8">
          <span className="text-brand-text font-bold text-sm tracking-tight">현재 보관 물품</span>
          <span className="text-3xl font-extrabold text-brand-primary tabular-nums leading-none">
            {itemCount}<span className="text-xs ml-1 font-bold uppercase tracking-widest">건</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleTeacher}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-[10px] sm:text-xs transition-all whitespace-nowrap ${
              isTeacher 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isTeacher ? <LogOut size={16} className="sm:w-[18px]" /> : <LogIn size={16} className="sm:w-[18px]" />}
            <span>{isTeacher ? '로그아웃' : '선생님 로그인'}</span>
          </motion.button>

          {isTeacher && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenUpload}
              className="btn-primary flex items-center gap-2.5 text-sm px-6 py-3"
            >
              <PlusCircle size={18} />
              <span className="hidden md:inline">물품 등록</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
