import React, { useState } from 'react';
import ItineraryDayCard from './ItineraryDayCard';

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

export default ItineraryTab;
