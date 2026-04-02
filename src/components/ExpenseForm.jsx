import React, { useState, useEffect, useRef } from 'react';

function ExpenseForm({
  friends,
  expense, // For editing mode
  formData,
  onChangeFormData,
  onToggleParticipant,
  onSubmit,
  isEditing = false,
  formRef,
  toHKD,
  toKRW,
}) {
  const PRESET_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Activities', 'Accommodation', 'Misc'];

  // Category emoji mapping
  const categoryEmojis = {
    'Food': '🍔',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Activities': '🎲',
    'Accommodation': '🏠',
    'Misc': '📦',
  };

  // Category color mapping
  const categoryColors = {
    'Food': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Transport': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'Shopping': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Activities': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Accommodation': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Misc': { bg: 'bg-stone-200', text: 'text-stone-700', border: 'border-stone-300' },
  };

  const data = formData;

  // Refs for tab buttons
  const equalBtnRef = useRef(null);
  const customBtnRef = useRef(null);

  // State for sliding indicator
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Helper to calculate equal split amount
  const getEqualSplitAmount = () => {
    const amount = parseFloat(data.amount) || 0;
    const count = data.participants.length;
    return count > 0 ? amount / count : 0;
  };

  // Check if custom splits sum matches total amount
  const getSplitTotalMatch = () => {
    const splitSum = Object.values(data.splits || {}).reduce((sum, val) => sum + (val || 0), 0);
    const total = parseFloat(data.amount) || 0;
    return Math.abs(splitSum - total) < 0.01;
  };

  // Initialize custom splits from current participants
  const initializeCustomSplits = (formData) => {
    const equalAmount = getEqualSplitAmount();
    const splits = {};
    formData.participants.forEach((p) => {
      splits[p] = equalAmount;
    });
    return splits;
  };

  // Handle split type change
  const handleSplitTypeChange = (type) => {
    if (type === 'custom') {
      onChangeFormData({
        ...data,
        splitType: 'custom',
        splits: initializeCustomSplits(data)
      });
    } else {
      onChangeFormData({
        ...data,
        splitType: 'equal'
      });
    }
  };

  // Handle participant toggle - preserve custom splits when possible
  const handleToggleParticipant = (friend) => {
    const isRemoving = data.participants.includes(friend);
    const newParticipants = isRemoving
      ? data.participants.filter((p) => p !== friend)
      : [...data.participants, friend];

    if (data.splitType === 'custom') {
      // Preserve existing split amounts; remove removed participant's split; add new participant with 0
      const newSplits = { ...data.splits };
      if (isRemoving) {
        delete newSplits[friend];
      } else {
        newSplits[friend] = 0; // New participant starts with 0, user can adjust
      }
      onChangeFormData({
        ...data,
        participants: newParticipants,
        splits: newSplits,
      });
    } else {
      onChangeFormData({
        ...data,
        participants: newParticipants,
      });
    }
  };

  // Update sliding indicator position when split type changes or on resize
  useEffect(() => {
    const updateIndicator = () => {
      if (data.splitType === 'equal' && equalBtnRef.current) {
        const { offsetLeft, offsetWidth } = equalBtnRef.current;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      } else if (customBtnRef.current) {
        const { offsetLeft, offsetWidth } = customBtnRef.current;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [data.splitType]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-2.5">
      <div className="py-0 mb-2">
        <label className="text-xs font-medium text-slate-600">What was it for?</label>
        <input
          type="text"
          value={data.desc}
          onChange={(e) =>
            onChangeFormData(prev => ({ ...prev, desc: e.target.value }))
          }
          className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1"
          required
        />
      </div>

      <div className="py-0 mb-2">
        <label className="text-xs font-medium text-slate-600 mb-2">Category</label>
        <div className="flex flex-wrap gap-1.5 py-1">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                onChangeFormData(prev => ({ ...prev, category: cat, categoryTags: [cat] }))
              }
              className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${
                data.category === cat
                  ? `${categoryColors[cat].bg} ${categoryColors[cat].text} ${categoryColors[cat].border}`
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span>{categoryEmojis[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mb-2">
        <div className="flex-1">
          <label className="text-xs font-medium text-slate-600">Amount</label>
          <input
            type="number"
            step="0.01"
            value={data.amount}
            onChange={(e) =>
              onChangeFormData(prev => ({ ...prev, amount: e.target.value }))
            }
            className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono  mt-1"
            required
          />
          {/* Conversion display */}
          {data.currency && (data.currency === 'KRW' || data.currency === 'HKD') && (
            (() => {
              const amount = parseFloat(data.amount) || 0;
              let converted = 0;
              let targetCurrency = '';
              if (data.currency === 'KRW') {
                converted = toHKD(amount, 'KRW');
                targetCurrency = 'HKD';
              } else if (data.currency === 'HKD') {
                converted = toKRW(amount, 'HKD');
                targetCurrency = 'KRW';
              }
              return (
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  ≈ {converted.toLocaleString()} {targetCurrency}
                </div>
              );
            })()
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-2">Currency</label>
          <select
            value={data.currency}
            onChange={(e) =>
              onChangeFormData(prev => ({ ...prev, currency: e.target.value }))
            }
            className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1"
          >
            <option value="KRW">KRW</option>
            <option value="HKD">HKD</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-2 py-1 mb-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-slate-600 mb-2">Paid by</label>
          <select
            value={data.payer}
            onChange={(e) =>
              onChangeFormData(prev => ({ ...prev, payer: e.target.value }))
            }
            className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1"
          >
            {friends.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="text-xs font-medium text-slate-600 mb-2">Date</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) =>
              onChangeFormData(prev => ({ ...prev, date: e.target.value }))
            }
            className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1"
            required
          />
        </div>
      </div>

      <div className="mb-0.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600">Split Among</label>
        </div>
        <p className="text-[11px] text-gray-500 mb-1.5">
          Equal split by default. Input below for specific amounts.
        </p>
        <div className="flex flex-wrap gap-1.5 py-1">
          {friends.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleToggleParticipant(f)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${
                data.participants.includes(f)
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-2 flex w-full p-1 bg-gray-100 rounded-full relative">
          {/* Sliding indicator */}
          <div
            className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-200 z-0"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
          <button
            type="button"
            ref={equalBtnRef}
            onClick={() => {
              onChangeFormData(prev => ({
                ...prev,
                splitType: 'equal'
                // Don't clear splits - preserve them for when we switch back to custom
              }));
            }}
            className={`flex-none px-6 md:px-12 py-1.5 text-xs font-medium rounded-full flex items-center justify-center transition-colors relative z-10 ${
              data.splitType === 'equal'
                ? 'text-indigo-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {data.splitType === 'equal' && (
              <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            Split equally
          </button>
          <button
            type="button"
            ref={customBtnRef}
            onClick={() => {
              onChangeFormData(prev => {
                // Only initialize splits if we don't have existing custom splits
                const hasExistingSplits = prev.splits && Object.keys(prev.splits).length > 0;
                const splits = hasExistingSplits ? prev.splits : initializeCustomSplits(prev);
                return {
                  ...prev,
                  splitType: 'custom',
                  splits,
                };
              });
            }}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-full flex items-center justify-center transition-colors relative z-10 ${
              data.splitType === 'custom'
                ? 'text-indigo-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {data.splitType === 'custom' && (
              <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            Specific amounts
          </button>
        </div>
          {data.splitType === 'equal' && (
            <div className="py-2 px-2.5 text-[11px] text-gray-500">
              👉 Split {data.participants.length} ways: {getEqualSplitAmount().toLocaleString()} {data.currency} each
              {data.currency && (data.currency === 'KRW' || data.currency === 'HKD') && (
                <span>
                  {' '}/ ~ {(() => {
                    const amount = getEqualSplitAmount();
                    let converted = 0;
                    if (data.currency === 'KRW') {
                      converted = toHKD(amount, 'KRW');
                    } else if (data.currency === 'HKD') {
                      converted = toKRW(amount, 'HKD');
                    }
                    return `${converted.toLocaleString()} ${data.currency === 'KRW' ? 'HKD' : 'KRW'}`;
                  })()}
                </span>
              )}
            </div>
          )}
          {data.splitType === 'custom' && (
            <div className="space-y-3 py-2 px-2.5">
            {/* Custom split amounts */}
            {(() => {
              const totalAmount = parseFloat(data.amount) || 0;
              const splitTotal = Object.values(data.splits || {}).reduce((sum, val) => sum + (val || 0), 0);

              return (
                <div className="space-y-1.5">
                  {data.participants.map((friend) => {
                    const amount = data.splits?.[friend] || '';
                    const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0';

                    return (
                      <div key={friend} className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 w-16 flex-shrink-0">{friend}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center bg-slate-50 rounded-lg overflow-hidden">
                            <span className="pl-2 pr-1 text-xs text-slate-400 select-none">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={amount}
                              onChange={(e) => {
                                let value = e.target.value;
                                // Only allow numbers with max 2 decimal places
                                if (value && !/^\d*\.?\d{0,2}$/.test(value)) {
                                  return;
                                }
                                const newAmount = value === '' ? 0 : parseFloat(value);
                                onChangeFormData(prev => ({
                                  ...prev,
                                  splits: {
                                    ...prev.splits,
                                    [friend]: newAmount
                                  }
                                }));
                              }}
                              className="flex-1 px-1 py-1 text-sm font-mono bg-transparent border-none focus:ring-0 focus:outline-none min-w-0"
                              placeholder="0"
                            />
                            <span className="px-1 text-xs text-slate-300 select-none">/</span>
                            <span className="pr-2 pl-1 text-xs text-slate-500 font-mono whitespace-nowrap">
                              {(totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0.0')}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className={`text-xs flex justify-end ${
                    Math.abs(splitTotal - totalAmount) < 0.01
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    <span>
                      Remaining to split: {(totalAmount - splitTotal).toLocaleString()} {data.currency}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;
