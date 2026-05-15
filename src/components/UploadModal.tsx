import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, MapPin, Calendar, Info, Package, Image as ImageIcon, HelpCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => Promise<void>;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    dateFound: new Date().toISOString().split('T')[0],
    description: '',
    privateNote: '',
    photoUrl: '',
    teacherName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Additional safeguard for password here if needed, but user asked for it in the calling button
    
    setIsSubmitting(true);
    try {
      await onUpload({ ...formData });
      setFormData({
        name: '',
        location: '',
        dateFound: new Date().toISOString().split('T')[0],
        description: '',
        privateNote: '',
        photoUrl: '',
        teacherName: ''
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert('등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-text/20 backdrop-blur-[2px]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-brand-bg p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-brand-text tracking-tight">분실물 등록</h2>
                <p className="text-brand-muted text-[10px] uppercase tracking-widest font-bold mt-1">교사용 관리 시스템</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all text-brand-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto bg-white custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Image Preview & Upload */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">물품 사진</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-accent/30 transition-all overflow-hidden relative group"
                  >
                    {formData.photoUrl ? (
                      <>
                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-brand-text/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <Camera className="text-white" size={32} />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Camera size={24} className="opacity-40" />
                        <span className="text-xs font-semibold">사진 업로드</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-[10px] text-center text-slate-400 font-medium">물건의 특징이 잘 보이게 등록해 주세요.</p>
                </div>

                {/* Right Side: Basic Info */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-brand-text mb-2 px-1">물건 이름</label>
                    <input
                      required
                      type="text"
                      placeholder="예: 파란색 필통"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary text-brand-text transition-all outline-none text-base font-bold"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-brand-text mb-2 px-1">발견 날짜</label>
                      <input
                        required
                        type="date"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary text-brand-text transition-all outline-none text-sm font-bold"
                        value={formData.dateFound}
                        onChange={e => setFormData({ ...formData, dateFound: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-text mb-2 px-1">수령 장소</label>
                      <input
                        required
                        type="text"
                        placeholder="(예) 교육정보부"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary text-brand-text transition-all outline-none text-sm font-bold"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-brand-text mb-2 px-1">담당 선생님 (선택)</label>
                    <input
                      type="text"
                      placeholder="성함을 입력하세요"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary text-brand-text transition-all outline-none text-base font-bold"
                      value={formData.teacherName}
                      onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-brand-text mb-2 px-1">물건 설명 (공개) (선택)</label>
                    <textarea
                      rows={2}
                      placeholder="학생들이 볼 수 있는 간단한 특징을 입력하세요."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary text-brand-text transition-all resize-none outline-none text-sm font-semibold"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20 relative overflow-hidden">
                <label className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest mb-3 relative z-10">
                  본인 확인용 메모 (비공개) (선택)
                  <HelpCircle size={16} className="opacity-70" />
                </label>
                <textarea
                  rows={2}
                  placeholder="주인만 알 수 있는 상세 특징을 기록하세요. (예: 지갑 속 현금 액수, 분실 장소 등)"
                  className="w-full bg-white border border-brand-primary/30 rounded-xl p-4 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary text-brand-text placeholder:text-slate-400 font-bold transition-all resize-none outline-none text-sm relative z-10"
                  value={formData.privateNote}
                  onChange={e => setFormData({ ...formData, privateNote: e.target.value })}
                />
              </div>

              <button
                disabled={isSubmitting}
                className="w-full flex items-center justify-center p-4 bg-brand-primary text-white rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-lg shadow-brand-primary/20 group"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Package size={18} />
                    시스템에 분실물 등록 완료
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
