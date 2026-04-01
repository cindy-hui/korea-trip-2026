import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { X, Edit3, Trash2 } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = forwardRef(
  (
    {
      mode,
      expense,
      formData,
      onChangeFormData,
      onSubmit,
      onClose,
      onDelete,
      onEdit,
      friends,
      toHKD,
      toKRW,
      closing = false,
      onCloseRequest,
    },
    ref
  ) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const formRef = useRef(null);

  // Expose close method to parent via ref
  useImperativeHandle(ref, () => ({
    close: () => {
      if (onCloseRequest) {
        onCloseRequest();
      }
    },
  }));

  // Keep a ref for the latest onClose to avoid effect reset
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // When closing prop becomes true, call onClosed after animation
  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        if (onCloseRef.current) {
          onCloseRef.current();
        }
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [closing]);

  const handleClose = () => {
    if (onCloseRequest) {
      onCloseRequest();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(expense.id);
    setShowDeleteConfirm(false);
    handleClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const success = onSubmit(e);
    if (success && mode === 'add') {
      handleClose();
    }
  };

  const handleToggleParticipant = (friend) => {
    const isRemoving = formData.participants.includes(friend);
    const newParticipants = isRemoving
      ? formData.participants.filter((p) => p !== friend)
      : [...formData.participants, friend];

    if (formData.splitType === 'custom') {
      const newSplits = { ...formData.splits };
      if (isRemoving) {
        delete newSplits[friend];
      } else {
        newSplits[friend] = 0;
      }
      onChangeFormData({
        ...formData,
        participants: newParticipants,
        splits: newSplits,
      });
    } else {
      onChangeFormData({
        ...formData,
        participants: newParticipants,
      });
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(expense);
      handleClose();
    }
  };

  const isAddOrEdit = mode === 'add' || mode === 'edit';
  const isView = mode === 'view';

  const title = mode === 'add' ? 'Add Expense' : mode === 'edit' ? 'Edit Expense' : 'Expense Details';

  const categoryEmojis = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Activities: '🎲',
    Accommodation: '🏠',
    Misc: '📦',
  };

  const categoryColors = {
    Food: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    Transport: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    Shopping: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    Activities: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    Accommodation: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Misc: { bg: 'bg-stone-200', text: 'text-stone-700', border: 'border-stone-300' },
  };

  const getCategoryStyle = (cat) => {
    const style = categoryColors[cat] || categoryColors['Misc'];
    return `${style.bg} ${style.text} ${style.border}`;
  };

  const renderViewMode = () => {
    const category = expense.categoryTags?.[0] || expense.category;
    const emoji = categoryEmojis[category] || '📦';
    const categoryStyle = getCategoryStyle(category);

    const equalSplitAmount = expense.participants.length > 0
      ? expense.amount / expense.participants.length
      : 0;

    const currency = expense.currency || 'KRW';

    return (
      <div className="p-5 py-3 space-y-3">
        {/* Description */}
        <div>
          <label className="text-xs font-medium text-slate-400">What was it for?</label>
          <p className="text-md font-semibold text-slate-800 mt-1">{expense.desc}</p>
        </div>

        {/* Category chips */}
        <div>
          <label className="text-xs font-medium text-slate-400">Category</label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${categoryStyle}`}>
              <span>{emoji}</span>
              <span>{category}</span>
            </span>
          </div>
        </div>

        {/* Amount and conversion */}
        <div>
          <label className="text-xs font-medium text-slate-400">Amount</label>
          <div className="flex items-baseline mt-1 gap-4">
            <div className="text-lg font-bold text-slate-800 font-mono">
              {expense.amount.toLocaleString()} {currency}
            </div>
            {(() => {
              const hkd = toHKD(expense.amount, currency);
              const krw = toKRW(expense.amount, currency);
              const conversionValue = currency === 'HKD' ? Math.round(krw) : Math.round(hkd);
              const conversionLabel = currency === 'HKD' ? 'KRW' : 'HKD';
              if (conversionValue === 0) return null;
              return (
                <div className="text-[10px] text-slate-400 font-mono">
                  ≈ {conversionValue.toLocaleString()} {conversionLabel}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Paid by and Date side by side */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-400">Paid by</label>
            <div className="text-sm font-semibold text-slate-800 mt-1">{expense.payer}</div>
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-400">Date</label>
            <div className="text-sm font-semibold text-slate-800 mt-1">{expense.date}</div>
          </div>
        </div>

        {/* Split Among - participants chips */}
        <div>
          <label className="text-xs font-medium text-slate-400">Split Among</label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {friends
              .filter((f) => expense.participants.includes(f))
              .map((f) => (
                <span
                  key={f}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200`}
                >
                  {f}
                </span>
              ))}
          </div>
          <p className="text-[11px] font-semibold text-gray-600 mt-3">
            {expense.splitType === 'equal'
              ? `👉  Split equally among ${expense.participants.length} ppl`
              : `👉  Split in specific amounts among ${expense.participants.length} ppl`}
          </p>
        </div>

        {/* Custom splits details if applicable */}
        {expense.splitType === 'custom' && expense.splits && (
          <div className="space-y-2 p-2 border border-slate-100 rounded-lg">
            {friends
              .filter((f) => expense.participants.includes(f))
              .map((friend) => {
                const amount = expense.splits[friend] || 0;
                const percentage = expense.amount > 0 ? ((amount / expense.amount) * 100).toFixed(1) : '0';
                return (
                  <div key={friend} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-16 flex-shrink-0">{friend}</span>
                    <div className="flex-1 flex items-center bg-slate-50 rounded-lg overflow-hidden">
                      <span className="pl-2 pr-1 text-xs text-slate-400 select-none">$</span>
                      <span className="flex-1 px-1 py-1 text-sm font-mono bg-transparent min-w-0">
                        {amount}
                      </span>
                      <span className="px-1 text-xs text-slate-300 select-none">/</span>
                      <span className="pr-2 pl-1 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  const renderFormMode = () => (
    <div className="p-4">
      <ExpenseForm
        friends={friends}
        formRef={formRef}
        formData={formData}
        onChangeFormData={onChangeFormData}
        onToggleParticipant={handleToggleParticipant}
        onSubmit={handleFormSubmit}
        isEditing={mode === 'edit'}
      />
    </div>
  );

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      ></div>

      {/* Bottom Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col transition-transform duration-300 ease-out ${
          closing ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Handle indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {isView ? renderViewMode() : renderFormMode()}
        </div>

        {/* Footer Actions */}
        {isView && (
          <div className="p-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        )}

        {isAddOrEdit && (
          <div className="p-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (formRef.current) {
                  formRef.current.requestSubmit();
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {mode === 'add' ? 'Add' : 'Update'}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Expense?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete "{expense.desc}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ExpenseModal;
