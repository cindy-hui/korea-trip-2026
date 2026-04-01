import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Plus } from 'lucide-react';
import { FRIENDS } from '../constants';
import SettlementsSummary from './SettlementsSummary';
import PieChart from './PieChart';
import ExpensesList from './ExpensesList';
import ExpenseModal from './ExpenseModal';

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

  const [modalMode, setModalMode] = useState(null); // 'add' | 'view' | 'edit' | null
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [topCardIndex, setTopCardIndex] = useState(0);

  // Sync modal with editingExpenseId prop for edit mode
  useLayoutEffect(() => {
    if (editingExpenseId && modalMode === 'edit') {
      // already in edit mode, fine
    } else if (editingExpenseId) {
      setModalMode('edit');
    }
  }, [editingExpenseId]);

  useLayoutEffect(() => {
    if (!editingExpenseId && modalMode === 'edit') {
      setModalMode(null);
      setSelectedExpense(null);
    }
  }, [editingExpenseId, modalMode]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalMode) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalMode]);

  // Participant toggle handler works for both add and edit modes
  const handleToggleParticipant = (friend) => {
    if (modalMode === 'edit') {
      // Edit mode: toggle in editFormData
      onChangeEditFormData((prev) => ({
        ...prev,
        participants: prev.participants.includes(friend)
          ? prev.participants.filter((p) => p !== friend)
          : [...prev.participants, friend],
      }));
    } else if (modalMode === 'add') {
      // Add mode: use the passed handler
      onToggleParticipant(friend);
    }
  };

  const closeModal = () => {
    if (modalMode === 'edit') {
      onCancelEdit();
    }
    setModalMode(null);
    setSelectedExpense(null);
  };

  const openAddModal = () => {
    if (editingExpenseId) {
      onCancelEdit(); // cancel any ongoing edit
    }
    // Reset form data to initial state when opening add modal
    onChangeNewExpense({
      desc: '',
      amount: '',
      payer: FRIENDS[0],
      participants: [...FRIENDS],
      category: 'Food',
      categoryTags: ['Food'],
      currency: 'KRW',
      date: new Date().toISOString().split('T')[0],
      splitType: 'equal',
      splits: {},
    });
    setSelectedExpense(null);
    setModalMode('add');
  };

  const openViewModal = (expense) => {
    setSelectedExpense(expense);
    setModalMode('view');
  };

  const openEditModal = (expense) => {
    // Use the existing startEdit handler to populate editFormData
    onStartEditExpense(expense);
    setSelectedExpense(expense);
    setModalMode('edit');
  };

  const handleDeleteExpense = (expenseId) => {
    onRemoveExpense(expenseId);
    // onRemoveExpense already updates state
    closeModal();
  };

  const handleAddSubmit = (e) => {
    const success = onAddExpense(e);
    if (success) {
      closeModal();
    }
    return success;
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
            <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200 flex-1 flex flex-col">
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
            <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200 flex-1 flex flex-col">
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
        onClick={openAddModal}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        <span>Add Expense</span>
      </button>

      {/* Recent Expenses Section */}
      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
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
          onExpenseClick={openViewModal}
          toHKD={toHKD}
          toKRW={toKRW}
        />
      </div>

      {/* Expense Modal */}
      {modalMode && (
        <ExpenseModal
          mode={modalMode}
          expense={selectedExpense}
          formData={modalMode === 'add' ? newExpense : editFormData}
          onChangeFormData={modalMode === 'add' ? onChangeNewExpense : onChangeEditFormData}
          onSubmit={modalMode === 'add' ? handleAddSubmit : onUpdateExpense}
          onClose={closeModal}
          onDelete={handleDeleteExpense}
          onEdit={openEditModal}
          friends={FRIENDS}
          toHKD={toHKD}
          toKRW={toKRW}
        />
      )}
    </div>
    </>
  );
}

export default ExpensesTab;
