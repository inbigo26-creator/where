import { motion } from 'motion/react';
import { PackageSearch, PlusCircle, LayoutDashboard } from 'lucide-react';
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
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
          <PackageSearch className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-text tracking-tight leading-none mb-1">주인님 어디 계세요</h1>
          <p className="text-[11px] font-bold text-brand-muted uppercase tracking-[0.1em]">인비고 분실물 통합 관리 시스템</p>
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
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all ${
              isTeacher 
                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isTeacher ? <LayoutDashboard size={18} /> : <PackageSearch size={18} />}
            <span>{isTeacher ? '전체 분실물 보기' : '선생님 로그인'}</span>
          </motion.button>

          {isTeacher && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
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
