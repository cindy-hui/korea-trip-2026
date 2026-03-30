// ItineraryTab.jsx
import React, { useState, useCallback, useRef } from 'react';
import { Plus, Trash2, Save, GripVertical, ChevronDown, MapPin } from 'lucide-react';

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
        text: '🏠 Leena\'s 엄마 at Suwon & Lunch',
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
      { id: 21, text: '🏠 Leena\'s 엄마 at Suwon' },
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
    ],
  },
  {
    id: 'day3',
    day: 'Day 3',
    date: 'Wednesday, April 8',
    items: [
      { id: 31, text: '🏠 Leena\'s 엄마 at Suwon' },
      {
        id: 32,
        text: '🌸 Guri Flower Bed (sakura season)',
        mapQuery: 'Guri Flower Bed',
        tips: 'Amazing spot for cherry blossoms! Takes about 1 hour from Suwon.',
      },
      {
        id: 33,
        text: '🍽️ Jamsu Station Bridge Area',
        mapQuery: 'Jamsu Station',
        tips: 'Fun area for food and photos!',
      },
      {
        id: 34,
        text: 'Y зависимый блины (hotteok) at Jamsu',
        mapQuery: '',
      },
      {
        id: 35,
        text: 'Cafe with a nice view',
        mapQuery: '',
      },
    ],
  },
  {
    id: 'day4',
    day: 'Day 4',
    date: 'Thursday, April 9',
    items: [
      { id: 41, text: '🏠 Leena\'s 엄마 at Suwon' },
      {
        id: 42,
        text: 'Day trip to Busan?',
        tips: 'Consider KTX (~2 hours, ~60,000 KRW one-way)',
      },
      {
        id: 43,
        text: 'Haeundae Beach',
        mapQuery: 'Haeundae Beach Busan',
      },
      {
        id: 44,
        text: 'Gwangalli Beach & Diamond Bridge view',
        mapQuery: 'Gwangalli Beach',
      },
      {
        id: 45,
        text: 'Busan Cinema Street & Gamcheon Cultural Village',
        mapQuery: 'Gamcheon Cultural Village',
      },
      {
        id: 46,
        text: 'Jalgachi Market (if time)',
        mapQuery: 'Jalgachi Market',
        tips: 'Famous for raw fish and street food. Open until late.',
      },
    ],
  },
  {
    id: 'day5',
    day: 'Day 5',
    date: 'Friday, April 10',
    items: [
      { id: 51, text: '🏠 Leena\'s 엄마 at Suwon' },
      {
        id: 52,
        text: 'Namsan Seoul Tower & Loving Locks',
        mapQuery: 'N Seoul Tower',
        tips: 'Take cable car or hike up. Great views!',
      },
      {
        id: 53,
        text: 'Bukchon Hanok Village',
        mapQuery: 'Bukchon Hanok Village',
        tips: 'Traditional Korean houses, great for photos!',
      },
      {
        id: 54,
        text: 'Ikseon-dong Hanok Village',
        mapQuery: 'Ikseon-dong',
        tips: 'Cute alleys with shops and cafes.',
      },
      {
        id: 55,
        text: 'Insadong for traditional crafts & tea',
        mapQuery: 'Insadong',
      },
      {
        id: 56,
        text: 'Myeongdong for shopping & street food',
        mapQuery: 'Myeongdong',
        tips: 'Busy area with lots of shops and street food stalls.',
      },
    ],
  },
];

// Child: ItineraryDayCard
function ItineraryDayCard({ day, isCollapsed, onToggleCollapse, onFieldChange, onAddItem, onRemove, onToggleEdit, isEditing, onDragStart, onDragOver, onDrop, onDragLeave, onDragEnd }) {
  const handleToggle = () => onToggleCollapse(day.id);
  const handleFieldChange = (itemId, field, value) => onFieldChange(day.id, itemId, field, value);
  const handleAddItem = () => onAddItem(day.id);
  const handleRemove = (itemId) => onRemove(day.id, itemId);
  const handleToggleEdit = () => onToggleEdit(day.id);

  const handleDayDragStart = (index) => {
    onDragStart(day.id, index);
  };

  const handleDayDragOver = (e) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDayDrop = () => {
    onDrop(day.id);
  };

  const handleDayDragLeave = () => {
    onDragLeave();
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4 hover:border-indigo-200"
      onDragOver={handleDayDragOver}
      onDrop={handleDayDrop}
      onDragLeave={handleDayDragLeave}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-1">
          <button onClick={handleToggle} className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-700 p-1 mr-2 flex-shrink-0 transition-colors" aria-label={isCollapsed ? "Expand" : "Collapse"}>
            <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
          {isEditing ? (
            <input
              type="text"
              value={day.day}
              onChange={(e) => handleFieldChange(day.id, 'day', e.target.value)}
              className="text-sm font-bold bg-transparent border-b border-indigo-300 focus:outline-none focus:border-indigo-500 text-slate-800"
            />
          ) : (
            <h3 className="text-sm font-bold text-slate-800">{day.day}</h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleToggleEdit} className="flex items-center justify-center text-sm font-medium text-indigo-500 bg-indigo-50 p-2 rounded-full flex-shrink-0 hover:bg-indigo-100 transition-colors" aria-label={isEditing ? "Save" : "Edit"}>
            {isEditing ? <Save className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {day.items.map((item, index) => (
            <ItineraryItem
              key={item.id}
              item={item}
              dayId={day.id}
              onFieldChange={handleFieldChange}
              onRemove={handleRemove}
              draggable
              onDragStart={() => handleDayDragStart(index)}
            />
          ))}
          <button onClick={handleAddItem} className="w-full mt-4 py-2 flex items-center justify-center text-xs font-medium text-slate-500 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </button>
        </div>
      )}
    </div>
  );
}

// Child: ItineraryItem
function ItineraryItem({ item, dayId, onFieldChange, onRemove, draggable, onDragStart }) {
  return (
    <div
      className="group relative p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors"
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-slate-300 mt-1 flex-shrink-0 cursor-grab" />
        <div className="flex-1 space-y-2">
          <input type="text" placeholder="Activity" value={item.text} onChange={(e) => onFieldChange(dayId, item.id, 'text', e.target.value)} className="w-full text-sm p-2 bg-transparent border-none focus:outline-none text-slate-700" />
          <input type="text" placeholder="Map location (optional)" value={item.mapQuery || ''} onChange={(e) => onFieldChange(dayId, item.id, 'mapQuery', e.target.value)} className="w-full text-xs p-2 bg-transparent border-none focus:outline-none text-slate-500" />
          <input type="text" placeholder="Tip (optional)" value={item.tips || ''} onChange={(e) => onFieldChange(dayId, item.id, 'tips', e.target.value)} className="w-full text-xs p-2 bg-transparent border-none focus:outline-none text-slate-500" />
        </div>
        <button onClick={() => onRemove(dayId, item.id)} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors opacity-0 group-hover:opacity-100" aria-label="Remove item">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Main
export default function ItineraryTab({ itinerary, setItinerary }) {
  const [collapsedDays, setCollapsedDays] = useState({});
  const [editingDayId, setEditingDayId] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragDayIdRef = useRef(null);
  const dragItemRef = useRef(null); // Store the dragged item itself

  const handleToggleCollapse = useCallback((dayId) => {
    setCollapsedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  }, []);

  const handleToggleEdit = useCallback((dayId) => {
    setEditingDayId(prev => (prev === dayId ? null : dayId));
  }, []);

  const handleFieldChange = useCallback((dayId, itemId, field, value) => {
    setItinerary(prev => prev.map(day =>
      day.id === dayId
        ? {
            ...day,
            items: day.items.map(item =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          }
        : day
    ));
  }, [setItinerary]);

  const handleAddItem = useCallback((dayId) => {
    setItinerary(prev => prev.map(day =>
      day.id === dayId
        ? {
            ...day,
            items: [
              ...day.items,
              { id: Date.now(), text: '', mapQuery: '', tips: '' },
            ],
          }
        : day
    ));
  }, [setItinerary]);

  const handleRemove = useCallback((dayId, itemId) => {
    setItinerary(prev => prev.map(day =>
      day.id === dayId
        ? { ...day, items: day.items.filter(item => item.id !== itemId) }
        : day
    ));
  }, [setItinerary]);

  // Reorder within the same day
  const handleReorderItems = useCallback((dayId, fromIndex, toIndex) => {
    setItinerary(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      const newItems = [...day.items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return { ...day, items: newItems };
    }));
  }, [setItinerary]);

  // Move item from one day to another
  const moveItineraryItem = useCallback((sourceDayId, destDayId, sourceIndex, destIndex) => {
    setItinerary(prev => {
      const sourceDay = prev.find(day => day.id === sourceDayId);
      if (!sourceDay) return prev;
      const itemToMove = sourceDay.items[sourceIndex];
      if (!itemToMove) return prev;

      // Remove from source day
      const newItinerary = prev.map(day => {
        if (day.id === sourceDayId) {
          return {
            ...day,
            items: day.items.filter((_, idx) => idx !== sourceIndex),
          };
        } else if (day.id === destDayId) {
          // Insert into destination day
          const newItems = [...day.items];
          newItems.splice(destIndex, 0, itemToMove);
          return { ...day, items: newItems };
        }
        return day;
      });

      return newItinerary;
    });
  }, [setItinerary]);

  // Drag handlers
  const handleDragStart = useCallback((dayId, index) => {
    dragDayIdRef.current = dayId;
    setDraggedItemIndex(index);
    // Store a reference to the dragged item data (for visual feedback if needed)
    const day = itinerary.find(d => d.id === dayId);
    if (day) {
      dragItemRef.current = day.items[index];
    }
  }, [itinerary]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (draggedItemIndex !== null) {
      setIsDragOver(true);
    }
  }, [draggedItemIndex]);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  // Handle drop on a day card - append to end of that day
  const handleDrop = useCallback((destDayId) => {
    const sourceDayId = dragDayIdRef.current;
    const sourceIndex = draggedItemIndex;

    if (sourceDayId !== null && sourceIndex !== null) {
      if (sourceDayId === destDayId) {
        // Reorder within same day: append to end (simple approach)
        handleReorderItems(destDayId, sourceIndex, Infinity);
      } else {
        // Move to different day: append to end
        moveItineraryItem(sourceDayId, destDayId, sourceIndex, Infinity);
      }
    }

    // Reset drag state
    setDraggedItemIndex(null);
    setIsDragOver(false);
    dragDayIdRef.current = null;
    dragItemRef.current = null;
  }, [draggedItemIndex, handleReorderItems, moveItineraryItem]);

  const handleDragEnd = useCallback(() => {
    setDraggedItemIndex(null);
    setDropTargetIndex(null);
    setIsDragOver(false);
    dragDayIdRef.current = null;
    dragItemRef.current = null;
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Itinerary</h2>
      </div>
      <div className="space-y-4">
        {itinerary.map(day => (
          <ItineraryDayCard
            key={day.id}
            day={day}
            isCollapsed={collapsedDays[day.id] || false}
            onToggleCollapse={handleToggleCollapse}
            onFieldChange={handleFieldChange}
            onAddItem={handleAddItem}
            onRemove={handleRemove}
            onToggleEdit={handleToggleEdit}
            isEditing={editingDayId === day.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
