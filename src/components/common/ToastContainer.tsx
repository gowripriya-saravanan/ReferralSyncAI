import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-[#2E9D68] shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-[#E9A23B] shrink-0" />;
            case 'error':
              return <XCircle className="w-5 h-5 text-[#D9534F] shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-[#176B87] shrink-0" />;
          }
        };

        const getBg = () => {
          switch (toast.type) {
            case 'success':
              return 'bg-[#2E9D68]/10 border-[#2E9D68]/30 text-[#17324D] shadow-sm';
            case 'warning':
              return 'bg-[#E9A23B]/10 border-[#E9A23B]/30 text-[#17324D] shadow-sm';
            case 'error':
              return 'bg-[#D9534F]/10 border-[#D9534F]/30 text-[#17324D] shadow-sm';
            default:
              return 'bg-white border-[#DCE8F0] text-[#17324D] shadow-sm';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-xs flex items-start gap-3 transition-all transform animate-in slide-in-from-bottom-2 ${getBg()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-snug text-[#17324D]">{toast.title}</h4>
              <p className="text-xs text-[#60758A] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-md text-[#60758A] hover:text-[#17324D] hover:bg-slate-100/50 transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

