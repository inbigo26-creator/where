import { motion } from 'motion/react';
import { PackageSearch, PlusCircle, ShieldCheck } from 'lucide-react';
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
    <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#e09ba9] rounded-xl flex items-center justify-center shadow-lg shadow-pink-100">
          <PackageSearch className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">주인님 어디 계세요</h1>
          <p className="text-[10px] font-semibold text-pink-400 uppercase tracking-widest">봄햇살 아래 분실물 찾기</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex bg-pink-50 border border-pink-100 rounded-2xl px-6 py-2 items-center gap-4">
          <span className="text-pink-900 font-medium text-xs">현재 대기 중인 물건</span>
          <span className="text-3xl font-black text-pink-400 tabular-nums leading-none">
            {itemCount}<span className="text-sm ml-1 font-bold">건</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isTeacher && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenUpload}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">물품 등록</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTeacher}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              isTeacher 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                : 'bg-white border border-slate-200 text-slate-400'
            }`}
          >
            <ShieldCheck size={16} />
            {isTeacher ? '선생님 모드 ON' : '선생님 입장'}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
