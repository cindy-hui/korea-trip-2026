// App.jsx
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, Component } from 'react';
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
  X,
  AlertCircle,
  GripVertical,
  ChevronDown,
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

const CATEGORY_PRESETS = ['Food', 'Transport', 'Shopping', 'Others']; // simple presets

const INITIAL_EXPENSE = {
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
};

// Itinerary components
function ItineraryItem({
  dayId,
  item,
  isEditing,
  onFieldChange,
  onRemove,
  isLast,
  index,
  isDraggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedItemIndex,
}) {
  const isDragging = draggedItemIndex === index;

  return (
    <li
      className={`flex gap-3 items-start group ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-50' : ''}`}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col items-center mt-1.5 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-indigo-300 relative z-10" />
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
          </div>
        ) : (
          <>
            <p className="text-sm font-medium leading-snug">{item.text}</p>
            {item.mapQuery && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  item.mapQuery + ' Seoul South Korea',
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs text-blue-500 mt-1 hover:underline"
              >
                <Map className="w-3 h-3 mr-1" /> View Map
              </a>
            )}
            {item.tips && (
              <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                💡 {item.tips}
              </p>
            )}
          </>
        )}
      </div>

      {isDraggable && (
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="p-1.5 transition-colors cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
            <GripVertical className="w-4 h-4" />
          </div>
          <button
            onClick={() => onRemove(dayId, item.id)}
            className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  );
}

function ItineraryDayCard({
  day,
  isEditing,
  isCollapsed,
  onFieldChange,
  onAddItem,
  onRemoveItem,
  onReorderItems,
  onMoveItem,
  onToggleCollapse,
  onToggleEdit,
}) {
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    setDropTargetIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      sourceDayId: day.id,
      sourceIndex: index
    }));
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetIndex(index);
    setIsDragOver(true);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('application/json');
    if (!dataStr) {
      setDraggedItemIndex(null);
      setDropTargetIndex(null);
      setIsDragOver(false);
      return;
    }

    const { sourceDayId, sourceIndex } = JSON.parse(dataStr);

    // If dropping on same day and same position, do nothing
    if (sourceDayId === day.id && sourceIndex === dropIndex) {
      setDraggedItemIndex(null);
      setDropTargetIndex(null);
      setIsDragOver(false);
      return;
    }

    if (sourceDayId === day.id) {
      // Reorder within the same day
      onReorderItems(day.id, sourceIndex, dropIndex);
    } else {
      // Move from another day
      onMoveItem(sourceDayId, day.id, sourceIndex, dropIndex);
    }

    setDraggedItemIndex(null);
    setDropTargetIndex(null);
    setIsDragOver(false);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDropTargetIndex(null);
    setIsDragOver(false);
  };

  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${isDragOver ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-100'}`}
      onDragLeave={() => {
        setIsDragOver(false);
        setDropTargetIndex(null);
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-700 p-1 mr-2 flex-shrink-0 transition-colors"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">{day.day}</h3>
            {isCollapsed && (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {day.items.length}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
            {day.date}
          </p>
        </div>
        <button
          onClick={onToggleEdit}
          className="flex items-center justify-center text-sm font-medium text-indigo-500 bg-indigo-50 p-2 rounded-full flex-shrink-0 hover:bg-indigo-100 transition-colors"
          aria-label={isEditing ? "Save" : "Edit"}
        >
          {isEditing ? (
            <Save className="w-4 h-4" />
          ) : (
            <Edit3 className="w-4 h-4" />
          )}
        </button>
      </div>

      {isEditing && (
        <p className="text-xs text-slate-500 mb-3 flex items-center">
          <GripVertical className="w-3 h-3 mr-1.5 text-slate-400" />
          Drag items to reorder or move to other days
        </p>
      )}

      {!isCollapsed && (
        <ul className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {day.items.map((item, idx) => (
            <React.Fragment key={item.id}>
              {dropTargetIndex === idx && draggedItemIndex !== idx && (
                <div className="relative h-1 bg-indigo-500 rounded-full -my-1.5 shadow-sm">
                  <div className="absolute inset-0 bg-indigo-400 rounded-full animate-pulse" />
                </div>
              )}
              <ItineraryItem
                dayId={day.id}
                item={item}
                isEditing={isEditing}
                onFieldChange={onFieldChange}
                onRemove={onRemoveItem}
                isLast={idx === day.items.length - 1}
                index={idx}
                isDraggable={isEditing}
                onDragStart={isEditing ? (e) => handleDragStart(e, idx) : undefined}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                draggedItemIndex={draggedItemIndex}
              />
            </React.Fragment>
          ))}
        </ul>
      )}

      {isEditing && !isCollapsed && (
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
  onFieldChange,
  onAddItem,
  onRemoveItem,
  onReorderItems,
  onMoveItem,
}) {
  const [editingDayId, setEditingDayId] = useState(null);
  const [collapsedDays, setCollapsedDays] = useState({});

  const toggleDayCollapse = (dayId) => {
    setCollapsedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold">Trip Itinerary</h2>

      {itinerary.map((day) => (
        <ItineraryDayCard
          key={day.id}
          day={day}
          isEditing={editingDayId === day.id}
          isCollapsed={collapsedDays[day.id] || false}
          onToggleCollapse={() => toggleDayCollapse(day.id)}
          onFieldChange={onFieldChange}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
          onReorderItems={onReorderItems}
          onMoveItem={onMoveItem}
          onToggleEdit={() => setEditingDayId((prev) => (prev === day.id ? null : day.id))}
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
  onRenameCategory,
  onRemoveCategory,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(category);

  const handleTitleBlur = () => {
    const newTitle = tempTitle.trim() || category;
    if (newTitle !== category) {
      onRenameCategory(category, newTitle);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        {isEditingTitle ? (
          <input
            autoFocus
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="font-bold text-slate-800 bg-transparent border-b border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingTitle(true)}
            className="font-bold text-slate-800 text-left text-sm"
          >
            {category}
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemoveCategory(category)}
          className="text-slate-300 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

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
  onAddCategory,
  onRenameCategory,
  onRemoveCategory,
}) {
  const [activeEditId, setActiveEditId] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Packing Checklist</h2>
        <button
          type="button"
          onClick={onAddCategory}
          className="text-xs font-medium text-indigo-500 hover:text-indigo-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add section
        </button>
      </div>

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
          onRenameCategory={onRenameCategory}
          onRemoveCategory={onRemoveCategory}
        />
      ))}
    </div>
  );
}

// Expenses components
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
                    <span className="text-xs font-medium text-slate-700">{s.to}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-600">
                      {(s.amount).toLocaleString()} KRW
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="font-bold text-slate-700">{formatHKD(hkd)}</span>
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

function ExpenseForm({
  friends,
  expense, // For editing mode
  formData,
  onChangeFormData,
  onToggleParticipant,
  onSubmit,
  isEditing = false,
  formRef,
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

  // Category color mapping - all categories use light indigo
  const categoryColors = {
    'Food': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Transport': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Shopping': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Activities': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Accommodation': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Misc': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  };

  const data = formData;

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

  // Handle participant toggle - need to update splits if in custom mode
  const handleToggleParticipant = (friend) => {
    const newParticipants = data.participants.includes(friend)
      ? data.participants.filter((p) => p !== friend)
      : [...data.participants, friend];

    if (data.splitType === 'custom') {
      // Re-initialize splits with equal distribution for the new participant set
      const newFormData = { ...data, participants: newParticipants };
      onChangeFormData({
        ...newFormData,
        splits: initializeCustomSplits(newFormData)
      });
    } else {
      onChangeFormData({
        ...data,
        participants: newParticipants
      });
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-2.5">
      <div className="py-0 mb-2">
        <label className="text-xs font-medium text-slate-700">What was it for?</label>
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

      <div className="flex space-x-4 mb-2">
        <div className="flex-1">
          <label className="text-xs font-medium text-slate-700">Amount</label>
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
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 mb-2">Currency</label>
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

      <div className="flex space-x-2 py-1 mb-2">
        <div className="flex-1">
          <label className="text-xs font-medium text-slate-700 mb-2">Paid by</label>
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
          <label className="text-xs font-medium text-slate-700 mb-2">Date</label>
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

      <div>
        <label className="text-xs font-medium text-slate-700 mb-2">Category</label>
        <div className="flex flex-wrap gap-1.5 py-1">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                onChangeFormData(prev => ({ ...prev, category: cat, categoryTags: [cat] }))
              }
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border flex items-center gap-1 ${
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

      <div className="mb-0.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">Split Among</label>
        </div>
        <div className="flex flex-wrap gap-1.5 py-1">
          {friends.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleToggleParticipant(f)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                data.participants.includes(f)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            onChangeFormData(prev => ({
              ...prev,
              splitType: prev.splitType === 'equal' ? 'custom' : 'equal',
              splits: prev.splitType === 'equal' ? initializeCustomSplits(prev) : undefined
            }));
          }}
          className={`mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium rounded-md border transition-colors ${
            data.splitType === 'custom'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {data.splitType === 'custom' && (
            <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <span>Input Custom Split Amount</span>
          <svg className={`w-3 h-3 transition-transform ${data.splitType === 'custom' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {/* Custom split configuration */}
        {data.splitType === 'custom' && (
          <div className="mt-2 border border-slate-200 space-y-3 rounded-lg py-2 px-2.5">
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
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
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
                  <div className={`text-xs flex items-center justify-between ${
                    Math.abs(splitTotal - totalAmount) < 0.01
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    <span>
                      Total: {totalAmount.toLocaleString()} {data.currency}
                    </span>
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
                      Paid by {exp.payer} • {exp.splitType === 'custom' ? 'Custom split' : `Split ${exp.participants.length} ways`}
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



class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="font-bold text-red-800 mb-2">Error</h3>
          <pre className="text-xs text-red-700 whitespace-pre-wrap">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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

function PieChart({ data }) {
  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1]); // Sort by value descending
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-slate-400 text-center">
          No expenses to display yet.
        </p>
      </div>
    );
  }

  // Category color mapping - fill uses -200, stroke uses -400, text uses darker -600
  const categoryColorMap = {
    'Food': { stroke: '#FACC15', fill: '#FEF9C3', text: '#CA8A04' },       // yellow-400/200, text: yellow-600
    'Transport': { stroke: '#F87171', fill: '#FEE2E2', text: '#DC2626' }, // red-400/200, text: red-600
    'Shopping': { stroke: '#F472B6', fill: '#FBCFE8', text: '#DB2777' },  // pink-400/200, text: pink-600
    'Activities': { stroke: '#FB923C', fill: '#FFDAB8', text: '#C2410c' }, // orange-400/200, text: orange-600
    'Accommodation': { stroke: '#60A5FA', fill: '#BFDBFE', text: '#2563EB' }, // blue-400/200, text: blue-600
    'Misc': { stroke: '#A8A29E', fill: '#E7E5E4', text: '#57534E' },       // stone-400/200, text: stone-600
  };

  // Calculate donut segments
  let cumulative = 0;
  const radius = 40;
  const innerRadius = 25;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 h-full">
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-52 h-52 transform -rotate-90">
          {entries.map(([key, value], idx) => {
            const percentage = (value / total) * 100;
            const startAngle = (cumulative / total) * 2 * Math.PI;
            const slice = (value / total) * 2 * Math.PI;
            const endAngle = startAngle + slice;
            cumulative += value;

            // Handle single slice (100%) by rendering it as nearly a full circle
            // to avoid SVG arc rendering issues with full circles
            const effectiveSlice = entries.length === 1 ? slice - 0.001 : slice;
            const effectiveEndAngle = startAngle + effectiveSlice;

            const x1 = 50 + radius * Math.cos(startAngle);
            const y1 = 50 + radius * Math.sin(startAngle);
            const x2 = 50 + radius * Math.cos(effectiveEndAngle);
            const y2 = 50 + radius * Math.sin(effectiveEndAngle);
            const x3 = 50 + innerRadius * Math.cos(startAngle);
            const y3 = 50 + innerRadius * Math.sin(startAngle);
            const x4 = 50 + innerRadius * Math.cos(effectiveEndAngle);
            const y4 = 50 + innerRadius * Math.sin(effectiveEndAngle);

            const largeArc = effectiveSlice > Math.PI ? 1 : 0;

            // Donut segment path
            const d = `
              M ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
              L ${x4} ${y4}
              A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x3} ${y3}
              Z
            `;

            const colors = categoryColorMap[key] || categoryColorMap['Misc'];
            return (
              <path
                key={key}
                d={d}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="0.5"
                className="transition-all hover:opacity-80"
              />
            );
          })}
          {/* Center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] fill-slate-600 font-bold transform rotate-90 origin-center"
          >
            {Math.round(total).toLocaleString()}
            <tspan x="50" dy="12" className="text-[7px] fill-slate-400 font-normal">
              HKD
            </tspan>
          </text>
        </svg>
      </div>

      <div className="flex-1 space-y-2.5 min-w-0 pr-6">
        {entries.map(([key, value]) => {
          const percentage = (value / total) * 100;
          const colors = categoryColorMap[key] || categoryColorMap['Misc'];
          return (
            <div key={key} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0 border"
                style={{ backgroundColor: colors.fill, borderColor: colors.stroke }}
              />
              <span className="text-xs font-medium text-slate-700 truncate min-w-[100px]">
                {key}
              </span>
              <div className="flex items-center gap-2 text-xs tabular-nums">
                <span className="text-slate-500 font-mono">
                  ${Math.round(value).toLocaleString()}
                </span>
                <span
                  className="font-bold"
                  style={{ color: colors.text }}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// Confirm Dialog Component
function ConfirmDialog({ isOpen, itemName, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onCancel}
      ></div>
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Content */}
        <div className="pt-5 pb-4 px-4">
          <div className="flex flex-col items-center text-center mb-2.5 mt-2 gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm font-normal text-slate-700">
              Delete{' '}
              <span className="font-semibold text-slate-800">"{itemName}"</span>?
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center mb-3.5">
            This action can't be undone
          </p>
          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-1.5 px-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY);
  const [packingList, setPackingList] = useState(INITIAL_PACKING_LIST);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState(INITIAL_EXPENSE);
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');
  const [expenseDateFilter, setExpenseDateFilter] = useState('All');
  const [summaryPerson, setSummaryPerson] = useState('All');
  const [krwRate, setKrwRate] = useState(() => {
    const saved = localStorage.getItem('korea_krw_rate');
    return saved ? parseFloat(saved) : 0.0052;
  });
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

  const TRIP_START = '2026-04-06';
  const TRIP_END = '2026-04-10';

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

  
  useEffect(() => {
    const savedItinerary = localStorage.getItem('korea_itinerary');
    const savedPacking = localStorage.getItem('korea_packing');
    const savedExpenses = localStorage.getItem('korea_expenses');

    if (savedItinerary) setItinerary(JSON.parse(savedItinerary));
    if (savedPacking) setPackingList(JSON.parse(savedPacking));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  useEffect(() => {
    localStorage.setItem('korea_itinerary', JSON.stringify(itinerary));
    localStorage.setItem('korea_packing', JSON.stringify(packingList));
    localStorage.setItem('korea_expenses', JSON.stringify(expenses));
    localStorage.setItem('korea_krw_rate', krwRate.toString());
  }, [itinerary, packingList, expenses, krwRate]);

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

      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full pb-safe flex justify-around px-3 py-2.5 shadow-sm rounded-t-2xl">
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