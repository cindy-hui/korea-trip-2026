import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

function ExpensesList({ groupedByDate, onRemove, onEdit, toHKD, toKRW }) {
  const dates = Object.keys(groupedByDate).sort((a, b) => (a < b ? 1 : -1));

  // Category emoji mapping for expense cards
  const categoryEmojis = {
    'Food': '🍔',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Activities': '🎲',
    'Accommodation': '🏠',
    'Misc': '📦',
  };

  // Category circle color mapping
  const categoryColors = {
    'Food': { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    'Transport': { bg: 'bg-red-50', text: 'text-red-700' },
    'Shopping': { bg: 'bg-pink-50', text: 'text-pink-700' },
    'Activities': { bg: 'bg-orange-50', text: 'text-orange-700' },
    'Accommodation': { bg: 'bg-blue-50', text: 'text-blue-700' },
    'Misc': { bg: 'bg-stone-200', text: 'text-stone-700' },
  };

  return (
    <div className="space-y-3">
      {dates.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          No expenses found.
        </p>
      ) : (
        dates.map((date) => (
          <div key={date} className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              {date}
            </p>
            {groupedByDate[date].map((exp) => {
              const currency = exp.currency || 'KRW';
              const hkd = toHKD(exp.amount, currency);
              const krw = toKRW(exp.amount, currency);
              // Show conversion to the other currency
              const conversionValue = currency === 'HKD' ? Math.round(krw) : Math.round(hkd);
              const conversionLabel = currency === 'HKD' ? 'KRW' : 'HKD';
              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-lg border border-slate-200"
                >
                  <div className="p-3">
                    {/* Row 1: Category + Description + Actions */}
                    <div className="flex items-center gap-2 mb-0.5">
                      {(() => {
                        const category = (exp.categoryTags || [exp.category])[0];
                        const colors = categoryColors[category] || categoryColors['Misc'];
                        const emoji = categoryEmojis[category] || '📦';
                        return (
                          <span className={`w-6 h-6 flex items-center justify-center text-sm ${colors.bg} ${colors.text} rounded-md flex-shrink-0`}>
                            {emoji}
                          </span>
                        );
                      })()}
                      <h4 className="text-sm font-medium text-slate-800 leading-snug flex-1 truncate">
                        {exp.desc}
                      </h4>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => onEdit(exp)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit expense"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemove(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Paid by and split info */}
                    <div className="text-[10px] text-slate-400">
                      Paid by {exp.payer} • {exp.splitType === 'custom' ? `Split ${exp.participants.length} ways (custom)` : `Split ${exp.participants.length} ways`}
                    </div>

                    {/* Row 3: Amount */}
                    <div className="flex justify-end items-center gap-2">
                      <div className="text-[10px] text-slate-400 font-mono">
                        ≈ {conversionValue.toLocaleString()} {conversionLabel}
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-slate-800">
                          {exp.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-600 ml-0.5 font-mono">
                          {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

export default ExpensesList;
