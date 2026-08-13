import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, title }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 rounded-t-xl sm:rounded-t-2xl z-10">
          <h3 id="modal-title" className="text-lg sm:text-xl font-bold pr-4 text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
