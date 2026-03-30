// App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  ListChecks,
  Receipt,
} from 'lucide-react';
import { db } from './db';
import {
  FRIENDS,
  INITIAL_ITINERARY,
  INITIAL_PACKING_LIST,
  INITIAL_EXPENSE,
  DEFAULT_KRW_RATE,
} from './constants';
import ItineraryTab from './components/ItineraryTab';
import PackingTab from './components/PackingTab';
import ExpensesTab from './components/ExpensesTab';
import ConfirmDialog from './components/ConfirmDialog';
import ErrorBoundary from './components/ErrorBoundary';

// Debug: Log when save happens
console.log('db object:', db);
console.log('db.saveAll type:', typeof db.saveAll);

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY);
  const [packingList, setPackingList] = useState(INITIAL_PACKING_LIST);
  const [expenses, setExpenses] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); // Prevent initial save overwrite
  const [newExpense, setNewExpense] = useState(INITIAL_EXPENSE);
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');
  const [expenseDateFilter, setExpenseDateFilter] = useState('All');
  const [summaryPerson, setSummaryPerson] = useState('All');
  const [krwRate, setKrwRate] = useState(DEFAULT_KRW_RATE);
  // Category tags system
  const [categories, setCategories] = useState([
    'Food', 'Transport', 'Shopping', 'Activities', 'Accommodation', 'Misc'
  ]);
  const [editingCategories, setEditingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('food');

  // Expense editing state
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editFormData, setEditFormData] = useState(INITIAL_EXPENSE);

  // Confirmation dialog state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    itemName: '',
    onConfirm: null,
  });

  const toHKD = (amount, currency) => {
    if (!amount) return 0;
    if (currency === 'KRW') return amount * krwRate;
    if (currency === 'USD') return amount * 7.8;
    return amount; // HKD or unknown
  };

  const toKRW = (amount, currency) => {
    const hkd = toHKD(amount, currency);
    return krwRate > 0 ? hkd / krwRate : 0; // Convert HKD back to KRW, avoid division by zero
  };

  // Confirmation dialog handlers
  const showConfirm = (itemName, onConfirm) => {
    setConfirmState({
      isOpen: true,
      itemName,
      onConfirm: () => {
        onConfirm();
        setConfirmState({ isOpen: false, itemName: '', onConfirm: null });
      },
    });
  };

  const handleCancelConfirm = () => {
    setConfirmState({ isOpen: false, itemName: '', onConfirm: null });
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (!exp) return false;
    const tags = exp.categoryTags || (exp.category ? [exp.category] : []);
    const matchCategory =
      expenseCategoryFilter === 'All' ||
      tags.includes(expenseCategoryFilter);

    let matchDate = true;
    if (expenseDateFilter !== 'All') {
      matchDate = exp.date === expenseDateFilter;
    }

    return matchCategory && matchDate;
  });

  const groupedByDate = filteredExpenses.reduce((acc, exp) => {
    const key = exp.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(exp);
    return acc;
  }, {});

  const summaryExpenses = expenses.filter((exp) => {
    if (summaryPerson === 'All') return true;
    return exp.participants.includes(summaryPerson);
  });

  const categoryTotalsHKD = summaryExpenses.reduce((acc, exp) => {
    const tags = exp.categoryTags || [exp.category];
    const primary = tags[0] || 'Others';
    const totalAmountHKD = toHKD(exp.amount, exp.currency || 'KRW');
    // If a specific person is selected, count only their share
    const amountHKD = summaryPerson === 'All'
      ? totalAmountHKD
      : (() => {
          // Custom split: use the person's specific share amount
          if (exp.splitType === 'custom' && exp.splits && exp.splits[summaryPerson] !== undefined) {
            const share = exp.splits[summaryPerson];
            return toHKD(share, exp.currency || 'KRW');
          }
          // Equal split or person not in custom splits: use equal division
          return totalAmountHKD / exp.participants.length;
        })();
    acc[primary] = (acc[primary] || 0) + amountHKD;
    return acc;
  }, {});

  // Load data from database on app startup
  useEffect(() => {
    const loadData = async () => {
      const data = await db.loadAll()
      setItinerary(data.itinerary)
      setPackingList(data.packingList)
      setExpenses(data.expenses)
      setKrwRate(data.krwRate)
      setDataLoaded(true) // Mark data as loaded to prevent initial save wipe
    }
    loadData()
  }, []);

  // Save data to database whenever it changes
  useEffect(() => {
    if (!dataLoaded) return; // Skip initial save until data is loaded from DB
    const saveData = async () => {
      console.log('💾 Save triggered with:', {
        itineraryCount: itinerary.length,
        packingKeys: Object.keys(packingList).length,
        expensesCount: expenses.length,
        krwRate
      })
      const result = await db.saveAll(itinerary, packingList, expenses, krwRate)
      console.log('Save result:', result)
    }
    saveData()
  }, [itinerary, packingList, expenses, krwRate, dataLoaded]);

  // itinerary handlers
  const handleItineraryFieldChange = (dayId, itemId, field, value) => {
    setItinerary((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              items: day.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : day,
      ),
    );
  };

  const addItineraryItem = (dayId) => {
    setItinerary((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              items: [
                ...day.items,
                { id: Date.now(), text: '', mapQuery: '', tips: '' },
              ],
            }
          : day,
      ),
    );
  };

  const removeItineraryItem = (dayId, itemId) => {
    setItinerary((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              items: day.items.filter((item) => item.id !== itemId),
            }
          : day,
      ),
    );
  };

  // Confirmation wrapper for itinerary item deletion
  const confirmRemoveItineraryItem = (dayId, itemId) => {
    const day = itinerary.find((d) => d.id === dayId);
    const item = day?.items.find((i) => i.id === itemId);
    if (item) {
      showConfirm(item.text || 'this itinerary item', () => {
        removeItineraryItem(dayId, itemId);
      });
    }
  };

  const reorderItineraryItems = (dayId, fromIndex, toIndex) => {
    setItinerary((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;

        const newItems = [...day.items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);

        return {
          ...day,
          items: newItems,
        };
      }),
    );
  };

  const moveItineraryItem = (sourceDayId, destDayId, sourceIndex, destIndex) => {
    setItinerary((prev) => {
      const sourceDay = prev.find((day) => day.id === sourceDayId);
      if (!sourceDay) return prev;
      const itemToMove = sourceDay.items[sourceIndex];
      if (!itemToMove) return prev;

      return prev.map((day) => {
        if (day.id === sourceDayId) {
          return {
            ...day,
            items: day.items.filter((_, idx) => idx !== sourceIndex),
          };
        } else if (day.id === destDayId) {
          const newItems = [...day.items];
          newItems.splice(destIndex, 0, itemToMove);
          return { ...day, items: newItems };
        }
        return day;
      });
    });
  };

  // packing handlers
  const togglePackingItem = (category, itemId) => {
    setPackingList((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    }));
  };

  const updatePackingItemName = (category, id, value) => {
    setPackingList((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === id ? { ...item, name: value } : item,
      ),
    }));
  };

  const addPackingItem = (category) => {
    const id = Date.now();
    setPackingList((prev) => ({
      ...prev,
      [category]: [...prev[category], { id, name: '', checked: false }],
    }));
    return id;
  };

  const removePackingItem = (category, id) => {
    setPackingList((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  // Confirmation wrapper for packing item deletion
  const confirmRemovePackingItem = (category, id) => {
    const categoryItems = packingList[category];
    const item = categoryItems?.find((i) => i.id === id);
    if (item) {
      showConfirm(item.name || 'this packing item', () => {
        removePackingItem(category, id);
      });
    }
  };

  const addPackingCategory = () => {
    const baseName = 'New section';
    let name = baseName;
    let counter = 1;

    // avoid duplicate keys
    while (packingList[name]) {
      counter += 1;
      name = `${baseName} ${counter}`;
    }

    setPackingList((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const renamePackingCategory = (oldName, newName) => {
    if (!newName || oldName === newName || packingList[newName]) return;

    setPackingList((prev) => {
      const { [oldName]: items, ...rest } = prev;
      return {
        ...rest,
        [newName]: items,
      };
    });
  };

  const removePackingCategory = (name) => {
    setPackingList((prev) => {
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  };

  // Confirmation wrapper for packing category deletion
  const confirmRemovePackingCategory = (name) => {
    showConfirm(name || 'this category', () => {
      removePackingCategory(name);
    });
  };

  // expense handlers
  const addExpense = (e) => {
    e.preventDefault();
    console.log('Add expense clicked:', newExpense); // Debug log
    // Validate description
    if (!newExpense.desc?.trim()) {
      console.warn('Description is required');
      return false;
    }
    // Validate amount
    if (!newExpense.amount) {
      console.warn('Amount is required');
      return false;
    }
    const amountNum = parseFloat(newExpense.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.warn('Invalid amount:', newExpense.amount);
      return false;
    }
    // Validate participants
    if (newExpense.participants.length === 0) {
      console.warn('At least one participant is required');
      return false;
    }

    // Validate custom splits sum matches amount
    if (newExpense.splitType === 'custom' && newExpense.splits) {
      const totalSplits = Object.values(newExpense.splits).reduce((sum, val) => sum + (val || 0), 0);
      const amount = parseFloat(newExpense.amount) || 0;
      if (Math.abs(totalSplits - amount) > 0.01) {
        alert('Custom splits must sum to the total amount');
        return false;
      }
    }

    const expense = {
      id: Date.now(),
      desc: newExpense.desc,
      amount: parseFloat(newExpense.amount),
      payer: newExpense.payer,
      participants: newExpense.participants,
      category: newExpense.category,
      categoryTags: newExpense.categoryTags || [newExpense.category],
      currency: newExpense.currency || 'KRW',
      date: newExpense.date,
      splitType: newExpense.splitType || 'equal',
      splits: newExpense.splits || {},
    };

    setExpenses((prev) => [expense, ...prev]);
    setNewExpense({
      ...INITIAL_EXPENSE,
      payer: newExpense.payer,
      participants: [...FRIENDS],
    });
    return true;
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Confirmation wrapper for expense deletion
  const confirmRemoveExpense = (id) => {
    const expense = expenses.find((exp) => exp.id === id);
    if (expense) {
      showConfirm(expense.desc || 'this expense', () => {
        removeExpense(id);
      });
    }
  };

  // Expense editing handlers
  const startEditExpense = (expense) => {
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
  };

  const updateExpense = (e) => {
    e.preventDefault();
    if (
      !editFormData.desc?.trim() ||
      !editFormData.amount ||
      editFormData.participants.length === 0
    ) {
      return;
    }

    // Validate custom splits sum matches amount
    if (editFormData.splitType === 'custom' && editFormData.splits) {
      const totalSplits = Object.values(editFormData.splits).reduce((sum, val) => sum + (val || 0), 0);
      const amount = parseFloat(editFormData.amount) || 0;
      if (Math.abs(totalSplits - amount) > 0.01) {
        alert('Custom splits must sum to the total amount');
        return;
      }
    }

    setExpenses((prev) =>
      prev.map((exp) =>
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
      )
    );
    setEditingExpenseId(null);
    setEditFormData(INITIAL_EXPENSE);
  };

  const cancelEdit = () => {
    setEditingExpenseId(null);
    setEditFormData(INITIAL_EXPENSE);
  };

  const toggleParticipant = (friend) => {
    setNewExpense((prev) => {
      const newParticipants = prev.participants.includes(friend)
        ? prev.participants.filter((p) => p !== friend)
        : [...prev.participants, friend];

      // If splitType is custom, reinitialize splits to equal distribution
      if (prev.splitType === 'custom') {
        const amount = parseFloat(prev.amount) || 0;
        const equalAmount = amount / newParticipants.length;
        const newSplits = {};
        newParticipants.forEach((p) => {
          newSplits[p] = equalAmount;
        });
        return {
          ...prev,
          participants: newParticipants,
          splits: newSplits,
        };
      }

      return {
        ...prev,
        participants: newParticipants,
      };
    });
  };

  const calculateNetBalances = () => {
    const balances = {};
    FRIENDS.forEach((f) => (balances[f] = 0));

    expenses.forEach((exp) => {
      const totalHKD = toHKD(exp.amount, exp.currency || 'KRW');
      const payer = exp.payer || FRIENDS[0];

      // Payer pays the full amount
      balances[payer] += totalHKD;

      // Deduct each person's share (including payer's share)
      if (exp.splitType === 'custom' && exp.splits) {
        // Custom split: use the specific amounts defined in splits
        Object.entries(exp.splits).forEach(([person, splitAmount]) => {
          if (splitAmount > 0) {
            const shareHKD = toHKD(splitAmount, exp.currency || 'KRW');
            balances[person] -= shareHKD;
          }
        });
      } else {
        // Equal split: divide equally among participants
        const participants = (exp.participants && exp.participants.length > 0) ? exp.participants : [exp.payer];
        const shareHKD = totalHKD / participants.length;
        participants.forEach((p) => {
          balances[p] -= shareHKD;
        });
      }
    });

    return balances;
  };

  const calculateSettlements = () => {
    const balances = calculateNetBalances();

    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([person, balance]) => {
      if (balance < -0.01) debtors.push({ person, amount: Math.abs(balance) });
      if (balance > 0.01) creditors.push({ person, amount: balance });
    });

    const settlements = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const min = Math.min(debtor.amount, creditor.amount);

      // show as KRW for familiarity
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: Math.round(toKRW(min, 'HKD')),
      });

      debtor.amount -= min;
      creditor.amount -= min;

      if (debtor.amount < 0.01) i += 1;
      if (creditor.amount < 0.01) j += 1;
    }

    return settlements;
  };

  const netBalances = useMemo(() => calculateNetBalances(), [expenses, toHKD]);
  const settlements = useMemo(() => calculateSettlements(), [expenses, toHKD]);

  // Category handlers
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
    // Optionally remove from existing expenses too, but for now just update state
  };

  return (
    <div className="flex flex-col h-screen bg-indigo-50/30 text-slate-800 font-sans">
      <header className="pt-6 pb-4 px-6 bg-white shadow-sm sticky top-0 z-10 rounded-b-3xl">
        <h1 className="text-xl font-bold text-indigo-500">
          Seoul 2026 🩷 ✨
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          April 6 - April 10 • Cindy, Leena, Mel, Soobin
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-24">
        {activeTab === 'itinerary' && (
          <ItineraryTab
            itinerary={itinerary}
            onFieldChange={handleItineraryFieldChange}
            onAddItem={addItineraryItem}
            onRemoveItem={confirmRemoveItineraryItem}
            onReorderItems={reorderItineraryItems}
            onMoveItem={moveItineraryItem}
          />
        )}

        {activeTab === 'packing' && (
          <PackingTab
            packingList={packingList}
            onToggleItem={togglePackingItem}
            onChangeItemName={updatePackingItemName}
            onAddItem={addPackingItem}
            onRemoveItem={confirmRemovePackingItem}
            onAddCategory={addPackingCategory}
            onRenameCategory={renamePackingCategory}
            onRemoveCategory={confirmRemovePackingCategory}
          />
        )}

        {activeTab === 'expenses' && (
          <ErrorBoundary>
            <ExpensesTab
              expenses={expenses}
              groupedByDate={groupedByDate}
              settlements={settlements}
              netBalances={netBalances}
              newExpense={newExpense}
              onChangeNewExpense={setNewExpense}
              onToggleParticipant={toggleParticipant}
              onAddExpense={addExpense}
              onRemoveExpense={confirmRemoveExpense}
              onStartEditExpense={startEditExpense}
              editingExpenseId={editingExpenseId}
              editFormData={editFormData}
              onChangeEditFormData={setEditFormData}
              onCancelEdit={cancelEdit}
              onUpdateExpense={updateExpense}
              categoryFilter={expenseCategoryFilter}
              onChangeCategoryFilter={setExpenseCategoryFilter}
              dateFilter={expenseDateFilter}
              onChangeDateFilter={setExpenseDateFilter}
              categoryTotalsHKD={categoryTotalsHKD}
              summaryPerson={summaryPerson}
              onChangeSummaryPerson={setSummaryPerson}
              toHKD={toHKD}
              toKRW={toKRW}
              krwRate={krwRate}
              setKrwRate={setKrwRate}
            />
          </ErrorBoundary>
        )}
      </main>

      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full pb-safe flex justify-around px-3 py-2.5 shadow-sm rounded-t-2xl z-20">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${
            activeTab === 'itinerary'
              ? 'text-indigo-500'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MapPin className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Itinerary</span>
        </button>
        <button
          onClick={() => setActiveTab('packing')}
          className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${
            activeTab === 'packing'
              ? 'text-indigo-500'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ListChecks className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Packing</span>
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${
            activeTab === 'expenses'
              ? 'text-indigo-500'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Receipt className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Expenses</span>
        </button>
      </nav>

      <div className="h-20 bg-indigo-50/30" />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        itemName={confirmState.itemName}
        onConfirm={() => confirmState.onConfirm && confirmState.onConfirm()}
        onCancel={handleCancelConfirm}
      />
    </div>
  );
}
