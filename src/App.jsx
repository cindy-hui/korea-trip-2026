// App.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, ListChecks, Receipt } from 'lucide-react';
import { db, DEFAULT_ITINERARY, DEFAULT_PACKING_LIST, DEFAULT_KRW_RATE } from './db';
import ItineraryTab from './components/ItineraryTab';
import PackingTab from './components/PackingTab';
import ExpensesTab from './components/ExpensesTab';

const DEBUG = import.meta.env.DEV;

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Data state - holds all persistent trip data
  const [itinerary, setItinerary] = useState(DEFAULT_ITINERARY);
  const [packingList, setPackingList] = useState(DEFAULT_PACKING_LIST);
  const [expenses, setExpenses] = useState([]);
  const [krwRate, setKrwRate] = useState(DEFAULT_KRW_RATE);

  // Load data from database on app startup
  useEffect(() => {
    const loadData = async () => {
      const data = await db.loadAll();
      setItinerary(data.itinerary);
      setPackingList(data.packingList);
      setExpenses(data.expenses);
      setKrwRate(data.krwRate);
      setDataLoaded(true);
    };
    loadData();
  }, []);

  // Save data to database whenever it changes
  useEffect(() => {
    if (!dataLoaded) return; // Skip initial save until data is loaded from DB
    const saveData = async () => {
      if (DEBUG) {
        console.log('💾 Save triggered:', {
          itineraryCount: itinerary.length,
          packingKeys: Object.keys(packingList).length,
          expensesCount: expenses.length,
          krwRate,
        });
      }
      const result = await db.saveAll(itinerary, packingList, expenses, krwRate);
      if (DEBUG) {
        console.log('Save result:', result);
      }
    };
    saveData();
  }, [itinerary, packingList, expenses, krwRate, dataLoaded]);

  return (
    <div className="flex flex-col h-screen bg-indigo-50/30 text-slate-800 font-sans">
      <header className="pt-6 pb-4 px-6 bg-white shadow-sm sticky top-0 z-10 rounded-b-3xl">
        <h1 className="text-xl font-bold text-indigo-500">Seoul 2026 🩷 ✨</h1>
        <p className="text-xs text-slate-500 mt-0.5">April 6 - April 10 • Cindy, Leena, Mel, Soobin</p>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-24">
        {activeTab === 'itinerary' && (
          <ItineraryTab itinerary={itinerary} setItinerary={setItinerary} />
        )}
        {activeTab === 'packing' && (
          <PackingTab packingList={packingList} setPackingList={setPackingList} />
        )}
        {activeTab === 'expenses' && (
          <ExpensesTab
            expenses={expenses}
            setExpenses={setExpenses}
            krwRate={krwRate}
            setKrwRate={setKrwRate}
          />
        )}
      </main>

      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full pb-safe flex justify-around px-3 py-2.5 shadow-sm rounded-t-2xl">
        <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${activeTab === 'itinerary' ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <MapPin className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Itinerary</span>
        </button>
        <button onClick={() => setActiveTab('packing')} className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${activeTab === 'packing' ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <ListChecks className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Packing</span>
        </button>
        <button onClick={() => setActiveTab('expenses')} className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${activeTab === 'expenses' ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <Receipt className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Expenses</span>
        </button>
      </nav>
    </div>
  );
}
