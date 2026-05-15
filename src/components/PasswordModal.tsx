import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
}

export default function PasswordModal({ isOpen, onClose, onConfirm, title }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
    }
  }, [isOpen]);

  const handleCharClick = (char: string) => {
    if (password.length < 4) {
      const newPassword = password + char;
      setPassword(newPassword);
      if (newPassword.length === 4) {
        if (newPassword === '1004') {
          onConfirm(newPassword);
          onClose();
        } else {
          setError(true);
          setTimeout(() => {
            setPassword('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPassword(password.slice(0, -1));
    setError(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-text/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-sm border border-slate-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-brand-text transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-inner">
                <Lock size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-brand-text mb-2 px-4 leading-tight">{title}</h3>
              <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-8">선생님 비밀번호 4자리를 입력하세요</p>

              {/* Password Display */}
              <div className={`flex gap-4 mb-10 ${error ? 'animate-shake' : ''}`}>
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      password.length > i 
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                        : 'border-slate-100 bg-slate-50'
                    } ${error ? 'border-red-400 bg-red-50' : ''}`}
                  >
                    {password.length > i ? (
                      <div className="w-3 h-3 rounded-full bg-current shadow-sm" />
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Pad */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleCharClick(num)}
                    className="h-16 flex items-center justify-center bg-slate-50 rounded-2xl text-xl font-bold text-brand-text hover:bg-brand-accent hover:text-brand-primary active:scale-95 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <div className="h-16" />
                <button
                  onClick={() => handleCharClick('0')}
                  className="h-16 flex items-center justify-center bg-slate-50 rounded-2xl text-xl font-bold text-brand-text hover:bg-brand-accent hover:text-brand-primary active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="h-16 flex items-center justify-center bg-slate-50 rounded-2xl text-sm font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all"
                >
                  CLR
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
