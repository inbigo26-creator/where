import { motion } from 'motion/react';
import { PackageSearch, PlusCircle } from 'lucide-react';
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
        <div 
          className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary cursor-pointer transition-transform hover:rotate-6"
          onClick={onToggleTeacher}
          title="관리자 전환"
        >
          <PackageSearch className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-text tracking-tight leading-none mb-1">주인님 어디 계세요</h1>
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">교내 분실물 통합 관리 시스템</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex bg-brand-accent/30 border border-brand-secondary/20 rounded-2xl px-5 py-2.5 items-center gap-6">
          <span className="text-brand-muted font-semibold text-xs">현재 보관 물품</span>
          <span className="text-2xl font-bold text-brand-primary tabular-nums leading-none">
            {itemCount}<span className="text-[10px] ml-1 font-bold uppercase">건</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isTeacher && (
            <motion.button
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
