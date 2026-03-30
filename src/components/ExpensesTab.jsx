// ExpensesTab.jsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const INITIAL_EXPENSE = {
  desc: '',
  amount: '',
  payer: 'Cindy',
  participants: ['Cindy', 'Leena', 'Mel', 'Soobin'],
  category: 'Food',
  categoryTags: ['Food'],
  currency: 'KRW',
  date: new Date().toISOString().split('T')[0],
  splitType: 'equal',
  splits: {},
};

const FRIENDS = ['Cindy', 'Leena', 'Mel', 'Soobin'];

const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Activities', 'Accommodation', 'Misc'];

// SettlementsSummary component
function SettlementsSummary({ settlements, netBalances, toHKD }) {
  const formatHKD = (amount) => `$${Math.round(amount).toLocaleString()} HKD`;

  if (settlements.length === 0) {
    return (
      <div className="flex items-center justify-center py-3 text-slate-500 bg-emerald-50 rounded-lg border border-emerald-100">
        <span className="text-sm flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          All settled up!
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Settlements</h4>
      <ul className="space-y-1.5">
        {settlements.map((s) => {
          const hkd = toHKD(s.amount, 'KRW');
          return (
            <li key={`${s.from}-${s.to}-${s.amount}`} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-md border border-slate-100">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-medium text-slate-600">{s.from}</span>
                <span className="text-xs text-slate-400">→</span>
                <span className="text-xs font-medium text-slate-700">{s.to}</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-slate-600">
                  {s.amount.toLocaleString()} KRW
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="font-bold text-slate-700">{formatHKD(hkd)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ConfirmDialog component
function ConfirmDialog({ isOpen, itemName, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Delete</h3>
        <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete "{itemName}"? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Child: ExpenseForm
function ExpenseForm({ data, onSubmit, onToggleParticipant, isEditing = false }) {
  const equalAmount = useMemo(() => {
    if (data.amount && data.participants.length > 0) {
      return (parseFloat(data.amount) / data.participants.length).toFixed(0);
    }
    return 0;
  }, [data.amount, data.participants]);

  const getSplitTotalMatch = () => {
    if (data.splitType === 'custom' && data.splits) {
      const total = Object.values(data.splits).reduce((sum, val) => sum + (val || 0), 0);
      const amount = parseFloat(data.amount) || 0;
      return Math.abs(total - amount) <= 0.01 ? 'match' : 'mismatch';
    }
    return 'n/a';
  };

  const splitStatus = getSplitTotalMatch();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-slate-700">What was it for?</label>
        <input type="text" value={data.desc} onChange={(e) => data.onChangeFormData?.({ ...data, desc: e.target.value })} className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g., Dinner, Taxi, Hotel..." required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-700">Amount</label>
          <input type="number" step="0.01" value={data.amount} onChange={(e) => data.onChangeFormData?.({ ...data, amount: e.target.value })} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="0" required />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700">Currency</label>
          <select value={data.currency} onChange={(e) => data.onChangeFormData?.({ ...data, currency: e.target.value })} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="KRW">KRW</option>
            <option value="HKD">HKD</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-700">Date</label>
          <input type="date" value={data.date} onChange={(e) => data.onChangeFormData?.({ ...data, date: e.target.value })} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700">Paid by</label>
          <select value={data.payer} onChange={(e) => data.onChangeFormData?.({ ...data, payer: e.target.value })} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {FRIENDS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Category</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {DEFAULT_CATEGORIES.map(cat => (
            <button key={cat} type="button" onClick={() => data.onChangeFormData?.({ ...data, category: cat, categoryTags: [cat] })} className={`px-2.5 py-1 text-xs font-medium rounded-full border ${data.category === cat ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Who's in?</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {FRIENDS.map(f => (
            <button key={f} type="button" onClick={() => onToggleParticipant(f)} className={`px-2.5 py-1 text-xs font-medium rounded-full border ${data.participants.includes(f) ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Split Type</label>
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={() => data.onChangeFormData?.({ ...data, splitType: 'equal' })} className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border ${data.splitType === 'equal' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
            Equal
          </button>
          <button type="button" onClick={() => data.onChangeFormData?.({ ...data, splitType: 'custom', splits: data.splits || {} })} className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border ${data.splitType === 'custom' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
            Custom
          </button>
        </div>
      </div>

      {data.splitType === 'custom' && (
        <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Custom amounts:</span>
            <span className={`font-mono ${splitStatus === 'match' ? 'text-emerald-600' : splitStatus === 'mismatch' ? 'text-red-600' : ''}`}>
              {splitStatus === 'match' ? '✓ Total matches' : splitStatus === 'mismatch' ? `⚠ ${equalAmount} each` : ''}
            </span>
          </div>
          {data.participants.map(p => (
            <div key={p} className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600 w-16">{p}</span>
              <input type="number" step="0.01" value={data.splits?.[p] || ''} onChange={(e) => data.onChangeFormData?.({
                ...data,
                splits: { ...data.splits, [p]: e.target.value },
              })} className="flex-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:border-indigo-400 font-mono" placeholder="0" />
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98]">
        {isEditing ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
}

// Main ExpensesTab component
export default function ExpensesTab({
  expenses,
  setExpenses,
  krwRate,
  setKrwRate,
}) {
  const [newExpense, setNewExpense] = useState(INITIAL_EXPENSE);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editFormData, setEditFormData] = useState(INITIAL_EXPENSE);
  const [sheetMode, setSheetMode] = useState(null); // 'add' | 'edit' | null
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Quick filter state (for future use)
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');
  const [expenseDateFilter, setExpenseDateFilter] = useState('All');
  const [summaryPerson, setSummaryPerson] = useState('All');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const toHKD = useCallback((amount, currency) => {
    if (!amount) return 0;
    if (currency === 'KRW') return amount * krwRate;
    if (currency === 'USD') return amount * 7.8;
    return amount;
  }, [krwRate]);

  const toKRW = useCallback((amount, currency) => {
    const hkd = toHKD(amount, currency);
    return krwRate > 0 ? hkd / krwRate : 0;
  }, [krwRate, toHKD]);

  const handleToggleParticipant = useCallback((friend) => {
    setNewExpense(prev => {
      const newParticipants = prev.participants.includes(friend)
        ? prev.participants.filter(p => p !== friend)
        : [...prev.participants, friend];

      if (prev.splitType === 'custom') {
        const amount = parseFloat(prev.amount) || 0;
        const equalAmount = newParticipants.length > 0 ? amount / newParticipants.length : 0;
        const newSplits = {};
        newParticipants.forEach(p => { newSplits[p] = equalAmount; });
        return { ...prev, participants: newParticipants, splits: newSplits };
      }

      return { ...prev, participants: newParticipants };
    });
  }, []);

  const handleAddExpense = useCallback((e) => {
    e.preventDefault();
    // Validation
    if (!newExpense.desc?.trim()) return;
    if (!newExpense.amount || isNaN(Number(newExpense.amount))) return;
    const amountNum = parseFloat(newExpense.amount);
    if (amountNum <= 0) return;
    if (newExpense.participants.length === 0) return;

    if (newExpense.splitType === 'custom' && newExpense.splits) {
      const totalSplits = Object.values(newExpense.splits).reduce((sum, val) => sum + (val || 0), 0);
      if (Math.abs(totalSplits - amountNum) > 0.01) {
        alert('Custom splits must sum to the total amount');
        return;
      }
    }

    const expense = {
      id: Date.now(),
      desc: newExpense.desc,
      amount: amountNum,
      payer: newExpense.payer,
      participants: newExpense.participants,
      category: newExpense.category,
      categoryTags: newExpense.categoryTags || [newExpense.category],
      currency: newExpense.currency || 'KRW',
      date: newExpense.date,
      splitType: newExpense.splitType || 'equal',
      splits: newExpense.splits || {},
    };

    setExpenses(prev => [expense, ...prev]);
    setNewExpense({
      ...INITIAL_EXPENSE,
      payer: newExpense.payer,
      participants: [...FRIENDS],
    });
    setSheetMode(null);
  }, [newExpense, setExpenses]);

  const handleRemoveExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    setConfirmDeleteId(null);
  }, [setExpenses]);

  const handleStartEditExpense = useCallback((expense) => {
    setEditingExpenseId(expense.id);
    setEditFormData({
      desc: expense.desc,
      amount: expense.amount.toString(),
      currency: expense.currency,
      category: expense.category,
      categoryTags: expense.categoryTags || [expense.category],
      payer: expense.payer,
      participants: [...expense.participants],
      date: expense.date,
      splitType: expense.splitType || 'equal',
      splits: expense.splits || {},
    });
    setSheetMode('edit');
  }, []);

  const handleUpdateExpense = useCallback((e) => {
    e.preventDefault();
    if (!editFormData.desc?.trim() || !editFormData.amount || editFormData.participants.length === 0) return;

    if (editFormData.splitType === 'custom' && editFormData.splits) {
      const totalSplits = Object.values(editFormData.splits).reduce((sum, val) => sum + (val || 0), 0);
      const amount = parseFloat(editFormData.amount) || 0;
      if (Math.abs(totalSplits - amount) > 0.01) {
        alert('Custom splits must sum to the total amount');
        return;
      }
    }

    setExpenses(prev => prev.map(exp =>
      exp.id === editingExpenseId
        ? {
            ...exp,
            desc: editFormData.desc,
            amount: parseFloat(editFormData.amount),
            currency: editFormData.currency,
            category: editFormData.category,
            categoryTags: editFormData.categoryTags,
            payer: editFormData.payer,
            participants: editFormData.participants,
            date: editFormData.date,
            splitType: editFormData.splitType,
            splits: editFormData.splits,
          }
        : exp
    ));
    setEditingExpenseId(null);
    setSheetMode(null);
  }, [editFormData, editingExpenseId, setExpenses]);

  const handleCancelEdit = useCallback(() => {
    setEditingExpenseId(null);
    setSheetMode(null);
  }, []);

  const groupedByDate = useMemo(() => {
    const groups = {};
    expenses.forEach(exp => {
      const date = exp.date || 'No date';
      if (!groups[date]) groups[date] = [];
      groups[date].push(exp);
    });
    return groups;
  }, [expenses]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedByDate).sort((a, b) => {
      if (a === 'No date') return 1;
      if (b === 'No date') return -1;
      return new Date(b) - new Date(a);
    });
  }, [groupedByDate]);

  const calculateNetBalances = useCallback(() => {
    const balances = {};
    FRIENDS.forEach(f => balances[f] = 0);

    expenses.forEach(exp => {
      const totalHKD = toHKD(exp.amount, exp.currency || 'KRW');
      const payer = exp.payer || FRIENDS[0];
      balances[payer] += totalHKD;

      if (exp.splitType === 'custom' && exp.splits) {
        Object.entries(exp.splits).forEach(([person, splitAmount]) => {
          if (splitAmount > 0) {
            const shareHKD = toHKD(splitAmount, exp.currency || 'KRW');
            balances[person] -= shareHKD;
          }
        });
      } else {
        const shareHKD = totalHKD / exp.participants.length;
        exp.participants.forEach(person => {
          balances[person] -= shareHKD;
        });
      }
    });

    return balances;
  }, [expenses, toHKD]);

  const calculateSettlements = useCallback(() => {
    const balances = calculateNetBalances();
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([person, balance]) => {
      if (balance < -0.01) {
        debtors.push({ person, amount: -balance });
      } else if (balance > 0.01) {
        creditors.push({ person, amount: balance });
      }
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);
      settlements.push({ from: debtor.person, to: creditor.person, amount });
      debtors[i].amount -= amount;
      creditors[j].amount -= amount;
      if (debtors[i].amount <= 0) i++;
      if (creditors[j].amount <= 0) j++;
    }
    return settlements;
  }, [calculateNetBalances]);

  const netBalances = useMemo(() => calculateNetBalances(), [calculateNetBalances]);
  const settlements = useMemo(() => calculateSettlements(), [calculateSettlements]);

  const categoryTotalsHKD = useMemo(() => {
    const totals = {};
    expenses.forEach(exp => {
      if (expenseCategoryFilter === 'All' || exp.category === expenseCategoryFilter) {
        totals[exp.category] = (totals[exp.category] || 0) + toHKD(exp.amount, exp.currency);
      }
    });
    return totals;
  }, [expenses, expenseCategoryFilter, toHKD]);

  const openAddSheet = useCallback(() => setSheetMode('add'), []);
  const closeSheet = useCallback(() => {
    setSheetMode(null);
    setEditingExpenseId(null);
  }, []);

  const handleFormDataChange = useCallback((updater) => {
    if (sheetMode === 'edit') {
      setEditFormData(prev => typeof updater === 'function' ? updater(prev) : updater);
    } else {
      setNewExpense(prev => typeof updater === 'function' ? updater(prev) : updater);
    }
  }, [sheetMode]);

  const handleSubmit = useCallback((e) => {
    if (sheetMode === 'edit') {
      handleUpdateExpense(e);
    } else {
      handleAddExpense(e);
    }
  }, [sheetMode, handleAddExpense, handleUpdateExpense]);

  // Simple top cards carousel (placeholder)
  const topCards = [
    { label: 'Total Expenses', value: `$${Object.values(categoryTotalsHKD).reduce((a, b) => a + b, 0).toLocaleString()}` },
    { label: 'KRW Rate', value: krwRate.toFixed(4) },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Expenses</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3" id="top-cards-carousel">
        {topCards.map(card => (
          <div key={card.label} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">{card.label}</div>
            <div className="text-lg font-bold font-mono text-indigo-600">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Settlements Summary */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <SettlementsSummary settlements={settlements} netBalances={netBalances} toHKD={toHKD} />
      </div>

      {/* Add/Edit Button */}
      <button type="button" onClick={openAddSheet} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
        <Plus className="w-5 h-5" />
        Add Expense
      </button>

      {/* Expense List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">All Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-4">No expenses yet.</p>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">{date}</div>
              {groupedByDate[date].map(exp => (
                <div key={exp.id} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">{exp.desc}</div>
                    <div className="text-xs text-slate-500">{exp.category} • {exp.payer} • {exp.participants.length} people</div>
                    <div className="text-xs font-mono text-slate-600 mt-1">
                      {exp.amount.toLocaleString()} {exp.currency} (~{Math.round(toHKD(exp.amount, exp.currency)).toLocaleString()} HKD)
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStartEditExpense(exp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDeleteId(exp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        itemName={expenses.find(e => e.id === confirmDeleteId)?.desc || 'this expense'}
        onConfirm={() => handleRemoveExpense(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Add/Edit Expense Sheet */}
      {sheetMode && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm" onClick={closeSheet}>
          <div className="bg-white w-full max-w-lg rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">{sheetMode === 'add' ? 'Add Expense' : 'Edit Expense'}</h3>
              <button onClick={closeSheet} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <ExpenseForm
              data={{
                ...(sheetMode === 'edit' ? editFormData : newExpense),
                onChangeFormData: handleFormDataChange,
              }}
              onSubmit={handleSubmit}
              onToggleParticipant={handleToggleParticipant}
              isEditing={sheetMode === 'edit'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
