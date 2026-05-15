import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, ImageIcon, Info } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => Promise<void>;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateFound: new Date().toISOString().split('T')[0],
    location: '',
    privateNote: '',
    photoUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpload(formData);
      onClose();
      setFormData({
        name: '',
        description: '',
        dateFound: new Date().toISOString().split('T')[0],
        location: '',
        privateNote: '',
        photoUrl: ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            className="relative bg-white w-full max-w-xl rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
          >
            <div className="bg-pink-50/50 p-6 sm:p-8 border-b border-pink-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-pink-900 tracking-tight">분실물 등록</h2>
                <p className="text-pink-600/60 text-[10px] uppercase tracking-widest font-bold">New Item Log</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 sm:p-3 hover:bg-pink-100 rounded-2xl transition-colors text-pink-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">물품 이름</label>
                  <input
                    required
                    type="text"
                    placeholder="예: 파란색 필통, 갤럭시 워치"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-400 text-slate-900 transition-all outline-none text-sm"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">습득 날짜</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-400 text-slate-900 transition-all outline-none text-sm"
                      value={formData.dateFound}
                      onChange={e => setFormData({ ...formData, dateFound: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1 text-nowrap">이미지 주소 (선택)</label>
                    <div className="relative">
                        <input
                          type="url"
                          placeholder="https://..."
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-pink-400 text-slate-900 transition-all outline-none text-sm"
                          value={formData.photoUrl}
                          onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                        />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">보관 위치</label>
                  <input
                    required
                    type="text"
                    placeholder="예: 3층 수학교무실"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-400 text-slate-900 transition-all outline-none text-sm"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">공개 설명</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="아이템의 상태나 특징을 간단히 적어주세요."
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-400 text-slate-900 transition-all resize-none outline-none text-sm"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="bg-slate-900 p-6 rounded-[32px] shadow-sm">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2">
                    본인 확인용 질문 <span className="text-[10px] lowercase font-normal italic opacity-60 text-white">(비공개)</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="주인만 알 수 있는 특징 (예: 필통 뒤 낙서, 에어팟 케이스 내부 스티커)"
                    className="w-full bg-white/10 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-pink-400 text-white placeholder:text-slate-500 transition-all resize-none outline-none text-sm"
                    value={formData.privateNote}
                    onChange={e => setFormData({ ...formData, privateNote: e.target.value })}
                  />
                </div>
              </div>

              <button
                disabled={isSubmitting}
                className="w-full flex items-center justify-center p-4 sm:p-5 bg-[#e09ba9] text-white rounded-2xl font-bold transition-all hover:bg-[#d48a99] active:scale-95 disabled:opacity-50 shadow-lg shadow-pink-100 mt-4 h-14"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    물품 등록 완료
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
