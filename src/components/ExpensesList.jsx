import React from 'react';

function ExpensesList({ groupedByDate, onExpenseClick, toHKD, toKRW }) {
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
    'Food': { cardBg: 'bg-yellow-50/70', badgeBg: 'bg-yellow-100', text: 'text-yellow-700' },
    'Transport': { cardBg: 'bg-red-50/70', badgeBg: 'bg-red-100', text: 'text-red-700' },
    'Shopping': { cardBg: 'bg-pink-50/70', badgeBg: 'bg-pink-100', text: 'text-pink-700' },
    'Activities': { cardBg: 'bg-orange-50/70', badgeBg: 'bg-orange-100', text: 'text-orange-700' },
    'Accommodation': { cardBg: 'bg-blue-50/70', badgeBg: 'bg-blue-100', text: 'text-blue-700' },
    'Misc': { cardBg: 'bg-stone-200/70', badgeBg: 'bg-stone-300', text: 'text-stone-700' },
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
              const category = (exp.categoryTags || [exp.category])[0];
              const colors = categoryColors[category] || categoryColors['Misc'];
              return (
                <div
                  key={exp.id}
                  className={`${colors.cardBg} rounded-xl cursor-pointer hover:bg-opacity-80 transition-colors`}
                  onClick={() => onExpenseClick(exp)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const category = (exp.categoryTags || [exp.category])[0];
                        const colors = categoryColors[category] || categoryColors['Misc'];
                        const emoji = categoryEmojis[category] || '📦';
                        return (
                          <span className={`w-6 h-6 flex items-center justify-center text-sm ${colors.badgeBg} ${colors.text} rounded-md flex-shrink-0`}>
                            {emoji}
                          </span>
                        );
                      })()}

                      {/* Left side: title and paid by */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-800 leading-snug truncate">
                          {exp.desc}
                        </h4>
                        <div className="text-[10px] text-slate-400">
                          Paid by {exp.payer} • {exp.splitType === 'custom' ? `Split ${exp.participants.length} ways (custom)` : `Split ${exp.participants.length} ways`}
                        </div>
                      </div>

                      {/* Right side: amount stacked with conversion */}
                      <div className="flex-shrink-0 text-right mr-2">
                        <div className="font-mono font-bold text-sm text-slate-800">
                          {exp.amount.toLocaleString()} {currency}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ≈ {conversionValue.toLocaleString()} {conversionLabel}
                        </div>
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
