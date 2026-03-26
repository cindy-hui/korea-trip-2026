// App.jsx
import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ListChecks,
  Receipt,
  Edit3,
  Save,
  Plus,
  Trash2,
  Map,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const FRIENDS = ['Cindy', 'Leena', 'Mel', 'Soobin'];

const INITIAL_ITINERARY = [
  {
    id: 'day1',
    day: 'Day 1',
    date: 'Monday, April 6',
    items: [
      {
        id: 11,
        text: '✈️ Arrive at Seoul Incheon Airport at 5.10 AM',
        mapQuery: 'Incheon Airport',
        tips: 'Buy a T-Money card at the convenience store and withdraw some KRW cash here.',
      },
      {
        id: 12,
        text: '🏠 Leena’s 엄마 at Suwon & Lunch',
        mapQuery: 'Suwon Station',
      },
      {
        id: 13,
        text: 'Visit Hwaseong Fortress',
        mapQuery: 'Hwaseong Fortress Suwon',
        tips: 'Lots of walking! Wear comfortable shoes.',
      },
      {
        id: 14,
        text: 'Walk on the streets of Suwon & Cafes',
        mapQuery: 'Suwon Haenggung-dong',
      },
      {
        id: 15,
        text: '📍 Gyeonggadang (Hanok Cafe)',
        mapQuery: 'Gyeonggadang Suwon',
      },
      {
        id: 16,
        text: '🎨 Acorn Caricature',
        mapQuery: 'Acorn Caricature',
        tips: '~7,000 KRW for A5 size, ~12,000 KRW for A4 canvas. Great group memory!',
      },
      {
        id: 17,
        text: 'Suwon Starfield & London Bagel Museum',
        mapQuery: 'Starfield Suwon',
        tips: 'Expect a long queue for the bagels. Grab a queue number as soon as you arrive!',
      },
    ],
  },
  {
    id: 'day2',
    day: 'Day 2',
    date: 'Tuesday, April 7',
    items: [
      { id: 21, text: '🏠 Leena’s 엄마 at Suwon' },
      {
        id: 22,
        text: '📝 Color Analysis',
        tips: 'Go bare-faced or with minimal makeup for the most accurate results!',
      },
      {
        id: 23,
        text: '🔍 Explore Seongsu (Jayeondo Salt Bread, Im Donut)',
        mapQuery: 'Seongsu-dong',
      },
      {
        id: 24,
        text: '☕ Cheonsang Gaok (Rooftop Cafe)',
        mapQuery: 'Cheonsang Gaok Seongsu',
      },
      {
        id: 25,
        text: '📸 Photobooth: WXCK Photo (Bathroom style)',
        mapQuery: 'WXCK Photo Seongsu',
      },
      {
        id: 26,
        text: '🛍️ Haus Nowhere Seoul & Blue Elephant Space',
        mapQuery: 'Haus Nowhere Seoul',
      },
      {
        id: 27,
        text: '🔍 Explore Hannam-dong & Low Coffee',
        mapQuery: 'Low Coffee Hannam',
      },
      {
        id: 28,
        text: '🌉 Banpo Bridge Sunset & Night Picnic',
        mapQuery: 'Banpo Bridge',
        tips: 'Moonlight Rainbow Fountain Shows: 19:30, 20:00, 20:30, 21:00. Bring a mat and order fried chicken delivery!',
      },
    ],
  },
  {
    id: 'day3',
    day: 'Day 3',
    date: 'Wednesday, April 8',
    items: [
      {
        id: 31,
        text: '🏠 Golden City Hotel Dongdaemun',
        mapQuery: 'Golden City Hotel Dongdaemun',
      },
      {
        id: 32,
        text: '✈️ Leena leaves for Incheon (Flight at 3:25 PM)',
        tips: 'Leave hotel by 12:30 PM latest to be safe.',
      },
      {
        id: 33,
        text: '💆‍♀️ Head Spa / Hair Perm / Eyebrows',
        tips: 'Pre-book these services via Instagram or Kakao beforehand.',
      },
      {
        id: 34,
        text: '🔍 Explore Myeongdong & Ikseon-dong',
        mapQuery: 'Ikseon-dong Hanok Village',
      },
      {
        id: 35,
        text: '🛍️ Explore Gangnam (NYUNYU)',
        mapQuery: 'NYUNYU Gangnam',
      },
      {
        id: 36,
        text: '🍶 Honey comb makgeolli & Explore Garosugil',
        mapQuery: 'Garosugil',
      },
      {
        id: 37,
        text: '🌸 Yeouido Hangang Park Picnic',
        mapQuery: 'Yeouido Hangang Park',
        tips: 'Spring Flower Festival! Expect crowds but beautiful cherry blossoms.',
      },
      { id: 38, text: '🍸 Bar hop & Night Out' },
    ],
  },
  {
    id: 'day4',
    day: 'Day 4',
    date: 'Thursday, April 9',
    items: [
      {
        id: 41,
        text: '🌸 Seokchon Lake Cherry Blossom Festival',
        mapQuery: 'Seokchon Lake Park',
        tips: 'Peak bloom! Great photo ops with the Lotte Tower in the back.',
      },
      { id: 42, text: '🏠 Golden City Hotel Dongdaemun' },
      {
        id: 43,
        text: '🔍 Explore Hongdae & Itaewon',
        mapQuery: 'Hongdae Shopping Street',
      },
      {
        id: 44,
        text: '📸 Photobooth: Eternalog, Hongdae',
        mapQuery: 'Eternalog Hongdae',
      },
      {
        id: 45,
        text: '🍸 Bar hop & Night Spaces',
        mapQuery: 'Itaewon',
      },
    ],
  },
  {
    id: 'day5',
    day: 'Day 5',
    date: 'Friday, April 10',
    items: [
      { id: 51, text: '🔄 Repeat places we LOVE or missed!' },
      {
        id: 52,
        text: '✈️ Mel & Cindy Leave for Incheon at 12 AM (Flight 2:30 AM)',
        tips: 'Pack luggage beforehand and do tax refunds at the airport.',
      },
    ],
  },
  {
    id: 'extra',
    day: 'To-Do / Food Ideas',
    date: 'Backup Plans & Eats',
    items: [
      {
        id: 61,
        text: '💄 Le Labo Seoul (Bukchon)',
        mapQuery: '5 Bukchon-ro 5na-gil',
      },
      {
        id: 62,
        text: '🦀 Marinated Raw Crab',
        mapQuery: '서울 마포구 마포대로 186-6',
      },
      {
        id: 63,
        text: '🍜 Myeongdong Kyoja (Michelin)',
        mapQuery: 'Myeongdong Kyoja Main Restaurant',
      },
      {
        id: 64,
        text: '🍗 Kyochon Pilbang (Hidden Speakeasy)',
        mapQuery: '127 Bogwang-ro',
      },
      {
        id: 65,
        text: '🦀 Odarijip Ganjang Gejang',
        mapQuery: 'Odarijip Myeongdong',
      },
      {
        id: 66,
        text: '🍞 Mil Toast Ikseon',
        mapQuery: 'Mil Toast Ikseon',
      },
      {
        id: 67,
        text: '🥞 Samcheongdong Hotteok',
        mapQuery: 'Samcheongdong Hotteok',
      },
      { id: 68, text: "🐙 Live Octopus (Mel's Request!)" },
    ],
  },
];

// 5-day oriented packing list, still with categories
const INITIAL_PACKING_LIST = {
  'Day 1 outfits': [
    { id: 1, name: 'Day 1 outfit', checked: false },
    { id: 2, name: 'Comfortable walking shoes', checked: false },
  ],
  'Day 2 outfits': [
    { id: 3, name: 'Day 2 outfit', checked: false },
    { id: 4, name: 'Light jacket', checked: false },
  ],
  'Day 3 outfits': [{ id: 5, name: 'Day 3 outfit', checked: false }],
  'Day 4 outfits': [{ id: 6, name: 'Day 4 outfit', checked: false }],
  'Day 5 outfits': [
    { id: 7, name: 'Day 5 comfy travel clothes', checked: false },
  ],
  Essentials: [
    { id: 8, name: 'Passport (Check expiry!)', checked: false },
    { id: 9, name: 'K-ETA (If required for your passport)', checked: false },
    { id: 10, name: 'T-Money Card (If you kept one from before)', checked: false },
    { id: 11, name: 'Cash (KRW) & Travel Cards (YouTrip/Wowpass)', checked: false },
  ],
  Electronics: [
    {
      id: 12,
      name: 'Universal Adapter (Korea uses Type C/F 220V)',
      checked: false,
    },
    { id: 13, name: 'Powerbank (Vital for long days out)', checked: false },
    { id: 14, name: 'E-SIM / Portable Wifi', checked: false },
    { id: 15, name: 'Phone/Camera Chargers', checked: false },
  ],
};

const INITIAL_EXPENSE = {
  desc: '',
  amount: '',
  payer: FRIENDS[0],
  participants: [...FRIENDS],
  category: 'Food',
  date: new Date().toISOString().split('T')[0],
};

// Itinerary components
function ItineraryItem({
  dayId,
  item,
  isEditing,
  onFieldChange,
  onRemove,
  isLast,
}) {
  return (
    <li className="flex gap-3 items-start group">
      <div className="flex flex-col items-center mt-1">
        <div className="w-2 h-2 rounded-full bg-indigo-300" />
        {!isLast && <div className="w-px h-full bg-indigo-100 mt-1 mb-1" />}
      </div>

      <div className="flex-1">
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={item.text}
                placeholder="Activity"
                onChange={(e) =>
                  onFieldChange(dayId, item.id, 'text', e.target.value)
                }
                className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="text"
                value={item.mapQuery || ''}
                placeholder="Map location (optional)"
                onChange={(e) =>
                  onFieldChange(dayId, item.id, 'mapQuery', e.target.value)
                }
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <input
                type="text"
                value={item.tips || ''}
                placeholder="Tip (optional)"
                onChange={(e) =>
                  onFieldChange(dayId, item.id, 'tips', e.target.value)
                }
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <button
              onClick={() => onRemove(dayId, item.id)}
              className="text-slate-400 hover:text-red-500 mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium leading-snug">{item.text}</p>
            {item.tips && (
              <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                💡 {item.tips}
              </p>
            )}
            {item.mapQuery && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  item.mapQuery + ' Seoul South Korea',
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs text-blue-500 mt-1.5 hover:underline"
              >
                <Map className="w-3 h-3 mr-1" /> View Map
              </a>
            )}
          </>
        )}
      </div>
    </li>
  );
}

function ItineraryDayCard({
  day,
  isEditing,
  onFieldChange,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">{day.day}</h3>
        <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
          {day.date}
        </p>
      </div>

      <ul className="space-y-4">
        {day.items.map((item, idx) => (
          <ItineraryItem
            key={item.id}
            dayId={day.id}
            item={item}
            isEditing={isEditing}
            onFieldChange={onFieldChange}
            onRemove={onRemoveItem}
            isLast={idx === day.items.length - 1}
          />
        ))}
      </ul>

      {isEditing && (
        <button
          onClick={() => onAddItem(day.id)}
          className="w-full mt-4 py-2 flex items-center justify-center text-xs font-medium text-slate-500 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </button>
      )}
    </div>
  );
}

function ItineraryTab({
  itinerary,
  isEditing,
  onToggleEdit,
  onFieldChange,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trip Itinerary</h2>
        <button
          onClick={onToggleEdit}
          className="flex items-center text-sm font-medium text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-1" /> Save
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-1" /> Edit
            </>
          )}
        </button>
      </div>

      {itinerary.map((day) => (
        <ItineraryDayCard
          key={day.id}
          day={day}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}

// Packing components
function PackingItem({
  category,
  item,
  isEditing,
  onStartEdit,
  onStopEdit,
  onToggle,
  onChangeName,
  onRemove,
}) {
  const showEditingUI = isEditing;

  return (
    <div className="flex items-center gap-3 group">
      <button
        type="button"
        onClick={() => onToggle(category, item.id)}
        className="relative flex items-center justify-center cursor-pointer"
      >
        <div
          className={`w-5 h-5 rounded border-2 transition-colors ${
            item.checked
              ? 'bg-indigo-500 border-indigo-500'
              : 'border-slate-300 bg-white'
          }`}
        />
        <CheckCircle2
          className={`absolute w-4 h-4 text-white transition-opacity ${
            item.checked ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </button>

      {showEditingUI ? (
        <input
          autoFocus
          type="text"
          value={item.name}
          onChange={(e) => onChangeName(category, item.id, e.target.value)}
          onBlur={onStopEdit}
          className="flex-1 text-sm bg-transparent border-b border-slate-300 focus:outline-none focus:border-indigo-500 text-slate-700"
        />
      ) : (
        <button
          type="button"
          onClick={onStartEdit}
          className={`flex-1 text-left text-sm ${
            item.checked ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}
        >
          {item.name || 'Tap to edit item'}
        </button>
      )}

      {showEditingUI && (
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onRemove(category, item.id)}
          className="text-slate-300 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function PackingCategoryCard({
  category,
  items,
  activeEditId,
  setActiveEditId,
  onToggle,
  onChangeName,
  onRemoveItem,
  onAddItem,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-3">{category}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <PackingItem
            key={item.id}
            category={category}
            item={item}
            isEditing={activeEditId === item.id}
            onStartEdit={() => setActiveEditId(item.id)}
            onStopEdit={() => setActiveEditId(null)}
            onToggle={onToggle}
            onChangeName={onChangeName}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
      <button
        onClick={() => {
          const id = onAddItem(category);
          setActiveEditId(id);
        }}
        className="mt-3 text-xs text-indigo-500 hover:text-indigo-600"
      >
        + Add item
      </button>
    </div>
  );
}

function PackingTab({
  packingList,
  onToggleItem,
  onChangeItemName,
  onAddItem,
  onRemoveItem,
}) {
  const [activeEditId, setActiveEditId] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold mb-4">Packing Checklist</h2>
      {Object.entries(packingList).map(([category, items]) => (
        <PackingCategoryCard
          key={category}
          category={category}
          items={items}
          activeEditId={activeEditId}
          setActiveEditId={setActiveEditId}
          onToggle={onToggleItem}
          onChangeName={onChangeItemName}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}

// Expenses components
function SettlementsSummary({ settlements }) {
  return (
    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
      <h3 className="font-bold text-indigo-800 mb-3 text-sm uppercase tracking-wider">
        Who owes whom?
      </h3>
      {settlements.length === 0 ? (
        <p className="text-sm text-indigo-600">Everyone is settled up! 🎉</p>
      ) : (
        <ul className="space-y-2">
          {settlements.map((s, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between text-sm bg-white p-3 rounded-xl shadow-sm"
            >
              <span className="font-medium text-slate-700">{s.from}</span>
              <div className="flex items-center text-indigo-400 px-2">
                <ArrowRight className="w-4 h-4 mx-1" />
                <span className="font-bold font-mono text-xs">
                  {s.amount.toLocaleString()} ₩
                </span>
                <ArrowRight className="w-4 h-4 mx-1" />
              </div>
              <span className="font-medium text-slate-700">{s.to}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExpenseForm({
  friends,
  newExpense,
  onChangeNewExpense,
  onToggleParticipant,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"
    >
      <h3 className="font-bold text-slate-800">Add Expense</h3>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">
          What was it for?
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Taxi to Hongdae"
          value={newExpense.desc}
          onChange={(e) =>
            onChangeNewExpense({ ...newExpense, desc: e.target.value })
          }
          className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            Amount (KRW)
          </label>
          <input
            type="number"
            required
            placeholder="0"
            min="0"
            value={newExpense.amount}
            onChange={(e) =>
              onChangeNewExpense({ ...newExpense, amount: e.target.value })
            }
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            Who Paid?
          </label>
          <select
            value={newExpense.payer}
            onChange={(e) =>
              onChangeNewExpense({ ...newExpense, payer: e.target.value })
            }
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {friends.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            Category
          </label>
          <input
            type="text"
            placeholder="e.g. Food, Transport"
            value={newExpense.category}
            onChange={(e) =>
              onChangeNewExpense({ ...newExpense, category: e.target.value })
            }
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Date</label>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              onChangeNewExpense({ ...newExpense, date: e.target.value })
            }
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500">
          Split among:
        </label>
        <div className="flex flex-wrap gap-2">
          {friends.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => onToggleParticipant(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                newExpense.participants.includes(f)
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white font-medium py-3 rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-colors"
      >
        Add Expense
      </button>
    </form>
  );
}

function ExpensesList({ expenses, onRemove }) {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-slate-800">Recent Expenses</h3>
      {expenses.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          No expenses added yet.
        </p>
      ) : (
        expenses.map((exp) => (
          <div
            key={exp.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group"
          >
            <div>
              <p className="text-sm font-bold text-slate-800">{exp.desc}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {exp.category} • {exp.date} • Paid by {exp.payer} • Split{' '}
                {exp.participants.length} ways
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-sm text-slate-700">
                {exp.amount.toLocaleString()} ₩
              </span>
              <button
                onClick={() => onRemove(exp.id)}
                className="text-slate-300 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ExpensesTab({
  expenses,
  settlements,
  newExpense,
  onChangeNewExpense,
  onToggleParticipant,
  onAddExpense,
  onRemoveExpense,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold mb-2">Split the Bill</h2>
      <SettlementsSummary settlements={settlements} />
      <ExpenseForm
        friends={FRIENDS}
        newExpense={newExpense}
        onChangeNewExpense={onChangeNewExpense}
        onToggleParticipant={onToggleParticipant}
        onSubmit={onAddExpense}
      />
      <ExpensesList expenses={expenses} onRemove={onRemoveExpense} />
    </div>
  );
}

// Main App
export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY);
  const [packingList, setPackingList] = useState(INITIAL_PACKING_LIST);
  const [expenses, setExpenses] = useState([]);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [newExpense, setNewExpense] = useState(INITIAL_EXPENSE);

  useEffect(() => {
    const savedItinerary = localStorage.getItem('korea_itinerary');
    const savedPacking = localStorage.getItem('korea_packing');
    const savedExpenses = localStorage.getItem('korea_expenses');
    const savedEdit = localStorage.getItem('korea_itinerary_editing');

    if (savedItinerary) setItinerary(JSON.parse(savedItinerary));
    if (savedPacking) setPackingList(JSON.parse(savedPacking));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedEdit) setIsEditingItinerary(savedEdit === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('korea_itinerary', JSON.stringify(itinerary));
    localStorage.setItem('korea_packing', JSON.stringify(packingList));
    localStorage.setItem('korea_expenses', JSON.stringify(expenses));
    localStorage.setItem('korea_itinerary_editing', String(isEditingItinerary));
  }, [itinerary, packingList, expenses, isEditingItinerary]);

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

  // expense handlers
  const addExpense = (e) => {
    e.preventDefault();
    if (
      !newExpense.desc ||
      !newExpense.amount ||
      newExpense.participants.length === 0
    )
      return;

    const expense = {
      id: Date.now(),
      desc: newExpense.desc,
      amount: parseFloat(newExpense.amount),
      payer: newExpense.payer,
      participants: newExpense.participants,
      category: newExpense.category,
      date: newExpense.date,
    };

    setExpenses((prev) => [expense, ...prev]);
    setNewExpense({
      ...INITIAL_EXPENSE,
      payer: newExpense.payer,
      participants: [...FRIENDS],
    });
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleParticipant = (friend) => {
    setNewExpense((prev) => ({
      ...prev,
      participants: prev.participants.includes(friend)
        ? prev.participants.filter((p) => p !== friend)
        : [...prev.participants, friend],
    }));
  };

  const calculateSettlements = () => {
    const balances = {};
    FRIENDS.forEach((f) => (balances[f] = 0));

    expenses.forEach((exp) => {
      const split = exp.amount / exp.participants.length;
      balances[exp.payer] += exp.amount;
      exp.participants.forEach((p) => {
        balances[p] -= split;
      });
    });

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

      settlements.push({ from: debtor.person, to: creditor.person, amount: min });

      debtor.amount -= min;
      creditor.amount -= min;

      if (debtor.amount < 0.01) i += 1;
      if (creditor.amount < 0.01) j += 1;
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  return (
    <div className="flex flex-col h-screen bg-indigo-50/30 text-slate-800 font-sans">
      <header className="pt-12 pb-6 px-6 bg-white shadow-sm sticky top-0 z-10 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-indigo-500">
          Seoul 2026 🩷 ✨
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          April 6 - April 10 • Cindy, Leena, Mel, Soobin
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-24">
        {activeTab === 'itinerary' && (
          <ItineraryTab
            itinerary={itinerary}
            isEditing={isEditingItinerary}
            onToggleEdit={() => setIsEditingItinerary((v) => !v)}
            onFieldChange={handleItineraryFieldChange}
            onAddItem={addItineraryItem}
            onRemoveItem={removeItineraryItem}
          />
        )}

        {activeTab === 'packing' && (
          <PackingTab
            packingList={packingList}
            onToggleItem={togglePackingItem}
            onChangeItemName={updatePackingItemName}
            onAddItem={addPackingItem}
            onRemoveItem={removePackingItem}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab
            expenses={expenses}
            settlements={settlements}
            newExpense={newExpense}
            onChangeNewExpense={setNewExpense}
            onToggleParticipant={toggleParticipant}
            onAddExpense={addExpense}
            onRemoveExpense={removeExpense}
          />
        )}
      </main>

      <nav className="bg-white border-t border-slate-100 fixed bottom-0 w-full pb-safe flex justify-around px-2 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] rounded-t-3xl">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${
            activeTab === 'itinerary'
              ? 'text-indigo-500'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MapPin
            className={`w-6 h-6 mb-1 ${
              activeTab === 'itinerary' ? 'fill-indigo-50' : ''
            }`}
          />
          <span className="text-[10px] font-bold tracking-wide">Itinerary</span>
        </button>
        <button
          onClick={() => setActiveTab('packing')}
          className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${
            activeTab === 'packing'
              ? 'text-indigo-500'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ListChecks
            className={`w-6 h-6 mb-1 ${
              activeTab === 'packing' ? 'fill-indigo-50' : ''
            }`}
          />
          <span className="text-[10px] font-bold tracking-wide">Packing</span>
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center p-2 min-w-[80px] rounded-xl transition-all ${
            activeTab === 'expenses'
              ? 'text-indigo-500'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Receipt
            className={`w-6 h-6 mb-1 ${
              activeTab === 'expenses' ? 'fill-indigo-50' : ''
            }`}
          />
          <span className="text-[10px] font-bold tracking-wide">Expenses</span>
        </button>
      </nav>

      <div className="h-20 bg-indigo-50/30" />
    </div>
  );
}
