import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { FRIENDS } from '../constants';
import SettlementsSummary from './SettlementsSummary';
import PieChart from './PieChart';
import ExpensesList from './ExpensesList';
import ExpenseForm from './ExpenseForm';

function ExpensesTab({
  expenses,
  groupedByDate,
  settlements,
  netBalances,
  newExpense,
  onChangeNewExpense,
  onToggleParticipant,
  onAddExpense,
  onRemoveExpense,
  onStartEditExpense,
  editingExpenseId,
  editFormData,
  onChangeEditFormData,
  onCancelEdit,
  onUpdateExpense,
  categoryFilter,
  onChangeCategoryFilter,
  dateFilter,
  onChangeDateFilter,
  categoryTotalsHKD,
  summaryPerson,
  onChangeSummaryPerson,
  toHKD,
  toKRW,
  krwRate,
  setKrwRate,
}) {
  const allCategories = Array.from(
    new Set(
      expenses.flatMap((e) => e.categoryTags || [e.category])
    )
  ).sort();

  // Shared constants with ExpenseForm
  const PRESET_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Activities', 'Accommodation', 'Misc'];
  const categoryEmojis = {
    'Food': '🍔',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Activities': '🎲',
    'Accommodation': '🏠',
    'Misc': '📦',
  };

  const [sheetMode, setSheetMode] = useState(null); // 'add' | 'edit' | null
  const [topCardIndex, setTopCardIndex] = useState(0);
  const formRef = useRef(null);

  // Sync bottom sheet with editingExpenseId prop (using useLayoutEffect to prevent flicker)
  useLayoutEffect(() => {
    if (editingExpenseId) {
      setSheetMode('edit');
    }
  }, [editingExpenseId]);

  useLayoutEffect(() => {
    if (!editingExpenseId && sheetMode === 'edit') {
      setSheetMode(null);
    }
  }, [editingExpenseId, sheetMode]);

  // Close sheet on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sheetMode) {
        if (sheetMode === 'edit') {
          onCancelEdit();
        }
        setSheetMode(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sheetMode, onCancelEdit]);

  // Participant toggle handler works for both add and edit modes
  const handleToggleParticipant = (friend) => {
    if (sheetMode === 'edit') {
      // Edit mode: toggle in editFormData
      onChangeEditFormData((prev) => ({
        ...prev,
        participants: prev.participants.includes(friend)
          ? prev.participants.filter((p) => p !== friend)
          : [...prev.participants, friend],
      }));
    } else {
      // Add mode: use the passed handler
      onToggleParticipant(friend);
    }
  };

  const closeSheet = () => {
    if (sheetMode === 'edit') {
      onCancelEdit();
    }
    setSheetMode(null);
  };

  const openAddSheet = () => {
    if (editingExpenseId) {
      onCancelEdit(); // cancel any ongoing edit
    }
    // Reset form data to initial state when opening add sheet
    onChangeNewExpense({
      desc: '',
      amount: '',
      payer: FRIENDS[0],
      participants: [...FRIENDS],
      category: 'Food',
      categoryTags: ['Food'],
      currency: 'KRW',
      date: new Date().toISOString().split('T')[0],
      splitType: 'equal', // 'equal' or 'custom'
      splits: {}, // { [friend]: amount } (optional, used when splitType is 'custom')
    });
    setSheetMode('add');
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Shared Expenses</h2>
      </div>

      {/* Top Cards Carousel */}
      <div className="flex flex-col gap-2">
        {/* Carousel */}
        <div
          id="top-cards-carousel"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 scrollbar-hide min-h-[350px]"
          onScroll={() => {
            const container = document.getElementById('top-cards-carousel');
            if (container) {
              const scrollPos = container.scrollLeft;
              const cardWidth = container.scrollWidth / 2;
              const newIndex = Math.round(scrollPos / cardWidth);
              if (newIndex !== topCardIndex && newIndex >= 0 && newIndex <= 1) {
                setTopCardIndex(newIndex);
              }
            }
          }}
        >
          {/* Card 1: Who owes whom? */}
          <div className="flex-shrink-0 w-[calc(100%-1rem)] snap-center flex flex-col">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 flex-1 flex flex-col">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-800 text-base">💰 Who owes whom?</h3>
                </div>
                <p className="text-xs text-indigo-500">Settlements between friends</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-5 bg-slate-300 rounded-full"></div>
                  <span className="text-xs text-slate-500">Conversion: 1 KRW =</span>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={krwRate}
                    onChange={(e) => setKrwRate(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-0.5 text-xs font-mono border border-indigo-200 rounded focus:outline-none focus:border-indigo-400"
                    title="Set KRW to HKD conversion rate"
                  />
                  <span className="text-xs text-slate-600">HKD</span>
                </div>
              </div>
              <SettlementsSummary
                settlements={settlements}
                netBalances={netBalances}
                toHKD={toHKD}
              />
            </div>
          </div>

          {/* Card 2: Expense Summary - matching style */}
          <div className="flex-shrink-0 w-[calc(100%-1rem)] snap-center flex flex-col">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 flex-1 flex flex-col">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-800 text-base">📊 Expense Summary</h3>
                  <select
                    value={summaryPerson}
                    onChange={(e) => onChangeSummaryPerson(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg"
                  >
                    <option value="All">All friends</option>
                    {FRIENDS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-indigo-500">Filtered by your participation in expenses</p>
              </div>
              <PieChart data={categoryTotalsHKD} />
            </div>
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => {
              setTopCardIndex(0);
              const container = document.getElementById('top-cards-carousel');
              if (container) container.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            className="transition-all duration-200"
            aria-label="View Who owes whom"
          >
            {topCardIndex === 0 ? (
              <div className="w-4 h-1 bg-indigo-600 rounded-full" />
            ) : (
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => {
              setTopCardIndex(1);
              const container = document.getElementById('top-cards-carousel');
              if (container) {
                const cardWidth = container.querySelector('div > div').offsetWidth;
                container.scrollTo({ left: cardWidth, behavior: 'smooth' });
              }
            }}
            className="transition-all duration-200"
            aria-label="View Expense Summary"
          >
            {topCardIndex === 1 ? (
              <div className="w-4 h-1 bg-indigo-600 rounded-full" />
            ) : (
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Add Expense CTA Button */}
      <button
        type="button"
        onClick={openAddSheet}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        <span>Add Expense</span>
      </button>

      {/* Recent Expenses Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-bold text-slate-800 text-base">🧾 Recent Expenses</h3>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFilter === 'All' ? '' : dateFilter}
                onChange={(e) => onChangeDateFilter(e.target.value || 'All')}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-auto"
              />
              <button
                onClick={() => onChangeDateFilter('All')}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 whitespace-nowrap"
              >
                All
              </button>
            </div>
          </div>
          {/* Category filter chips */}
          <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
            <button
              type="button"
              onClick={() => onChangeCategoryFilter('All')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border flex items-center gap-1 flex-shrink-0 ${
                categoryFilter === 'All'
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onChangeCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full border flex items-center gap-1 flex-shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span>{categoryEmojis[cat]}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
        <ExpensesList
          groupedByDate={groupedByDate}
          onRemove={onRemoveExpense}
          onEdit={onStartEditExpense}
          toHKD={toHKD}
          toKRW={toKRW}
        />
      </div>

      {/* Modal */}
      {sheetMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={closeSheet}
          ></div>
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                {sheetMode === 'add' ? 'Add Expense' : 'Edit Expense'}
              </h3>
              <button
                onClick={closeSheet}
                className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Form content with scroll */}
            <div className="flex-1 overflow-y-auto px-4 pt-0 pb-3">
              <div className="border border-indigo-200 rounded-xl py-2 p-3">
                <ExpenseForm
                  friends={FRIENDS}
                  formRef={formRef}
                  formData={sheetMode === 'add' ? newExpense : editFormData}
                  onChangeFormData={
                    sheetMode === 'add' ? onChangeNewExpense : onChangeEditFormData
                  }
                  onToggleParticipant={handleToggleParticipant}
                  onSubmit={
                    sheetMode === 'add'
                      ? (e) => {
                          const success = onAddExpense(e);
                          if (success) closeSheet();
                        }
                      : onUpdateExpense
                  }
                  isEditing={sheetMode === 'edit'}
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="px-4 pb-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.requestSubmit();
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {sheetMode === 'add' ? 'Add' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ExpensesTab;
