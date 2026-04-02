import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold">Trip Itinerary</h2>

      {/* Notion Link Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <a
              href="https://www.notion.so/melsjournal/Korea-2026-31fa6ae7f7c6804abd52ca220901378d"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 text-sm text-amber-700 hover:text-amber-800 flex items-center gap-1 break-all"
            >
              View full itinerary on Notion
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        </div>
      </div>

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
