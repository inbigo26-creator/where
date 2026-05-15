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
  itemCount 
}: Omit<HeaderProps, 'onToggleTeacher'>) {
  return (
    <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#9dc093] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
          <PackageSearch className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">주인님 어디 계세요</h1>
          <p className="text-[10px] font-semibold text-green-500 uppercase tracking-widest">School Lost & Found System</p>
        </div>
      </div>

        <div className="flex items-center gap-6">
        <div className="hidden lg:flex bg-green-50 border border-green-100 rounded-3xl px-8 py-4 items-center gap-6 shadow-sm">
          <span className="text-green-900 font-bold text-sm">현재 대기 중인 물건</span>
          <span className="text-4xl font-black text-green-500 tabular-nums leading-none">
            {itemCount}<span className="text-base ml-1 font-bold">건</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isTeacher && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenUpload}
              className="btn-primary flex items-center gap-3 text-base px-8 py-4"
            >
              <PlusCircle size={22} />
              <span className="hidden sm:inline">물품 등록</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
