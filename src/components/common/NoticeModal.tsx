import React from 'react';
import { Sparkles, X, ArrowRight, Layers } from 'lucide-react';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  moduleName: string;
  description: string;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  title,
  moduleName,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCE8F0] relative transform transition-all animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#60758A] hover:text-[#17324D] hover:bg-[#EDF5FA] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] border border-[#C9DCE8] flex items-center justify-center text-[#176B87]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#176B87] bg-[#EDF5FA] px-2 py-0.5 rounded-md border border-[#C9DCE8] mb-0.5">
              {moduleName}
            </span>
            <h3 className="text-lg font-bold text-[#17324D]">{title}</h3>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-[#60758A] leading-relaxed mb-5">
          {description}
        </p>

        <div className="bg-[#F4F8FC] rounded-xl p-3.5 border border-[#DCE8F0] flex items-start gap-3 mb-6">
          <div className="p-1 rounded bg-[#F0F6FE] text-[#5B8DEF] border border-[#5B8DEF]/30 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-xs text-[#60758A]">
            <p className="font-semibold text-[#17324D]">Module 1 is currently active</p>
            <p className="mt-0.5">You are previewing the Main Dashboard UI with isolated mock data. Interactive referral creation, patient records, and live AI coordination workflows will be integrated in subsequent modules.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Got it, explore Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

