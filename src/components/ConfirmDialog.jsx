import React from 'react';
import { AlertCircle } from 'lucide-react';

function ConfirmDialog({ isOpen, itemName, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onCancel}
      ></div>
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Content */}
        <div className="pt-5 pb-4 px-4">
          <div className="flex flex-col items-center text-center mb-2.5 mt-2 gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm font-normal text-slate-700">
              Delete{' '}
              <span className="font-semibold text-slate-800">"{itemName}"</span>?
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center mb-3.5">
            This action can't be undone
          </p>
          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-1.5 px-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
