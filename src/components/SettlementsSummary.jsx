import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { FRIENDS } from '../constants';

function SettlementsSummary({ settlements, netBalances, toHKD }) {
  // Sort friends by absolute balance (descending) for visual hierarchy
  const sortedFriends = [...FRIENDS].sort((a, b) => Math.abs(netBalances[b] || 0) - Math.abs(netBalances[a] || 0));

  const formatHKD = (amount) => `$${Math.round(amount).toLocaleString()} HKD`;

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
      {/* Net Balances */}
      <div className="grid grid-cols-2 gap-2.5">
        {sortedFriends.map((friend) => {
          const balance = netBalances[friend] || 0;
          const isPositive = balance > 0.01;
          const absBalance = Math.abs(balance);

          return (
            <div
              key={friend}
              className={`p-2.5 rounded-lg border ${
                isPositive
                  ? 'bg-emerald-50 border-emerald-200'
                  : balance < -0.01
                  ? 'bg-red-50 border-red-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  {friend}
                </span>
                {isPositive ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : balance < -0.01 ? (
                  <AlertCircle className="w-3 h-3 text-red-600" />
                ) : (
                  <span className="text-slate-400 text-xs">−</span>
                )}
              </div>
              <div
                className={`text-base font-bold font-mono ${
                  isPositive ? 'text-emerald-700' : balance < -0.01 ? 'text-red-700' : 'text-slate-600'
                }`}
              >
                {isPositive ? '+' : ''}
                {formatHKD(absBalance)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Settlement Plan */}
      {settlements.length === 0 ? (
        <div className="flex items-center justify-center py-3 text-slate-500">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
          <span className="text-sm">All settled up!</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Settlements
          </h4>
          <ul className="space-y-1">
            {settlements.map((s, idx) => {
              const hkd = toHKD(s.amount, 'KRW');
              return (
                <li
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2 bg-slate-50 rounded-md border border-slate-100"
                >
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-xs font-medium text-slate-600">{s.from}</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-xs font-medium text-slate-600">{s.to}</span>
                  </div>
                  <div className="text-right">
                    <div className=" text-[10px] font-mono text-slate-500">
                      ≈ {(s.amount).toLocaleString()} KRW
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-xs font-bold text-slate-700">{formatHKD(hkd)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SettlementsSummary;
