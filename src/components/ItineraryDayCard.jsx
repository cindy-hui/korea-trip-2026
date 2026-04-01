import React, { useState } from 'react';
import { ChevronDown, Save, Edit3, Plus, GripVertical } from 'lucide-react';
import ItineraryItem from './ItineraryItem';

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
      className={`px-0 transition-all ${isDragOver ? 'border-l-4 border-indigo-200' : ''}`}
      onDragLeave={() => {
        setIsDragOver(false);
        setDropTargetIndex(null);
      }}
    >
      <div className="flex justify-between items-start mb-3">
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
        {!isCollapsed && (
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
        )}
      </div>

      {isEditing && (
        <p className="text-xs text-slate-500 mb-3 flex items-center">
          <GripVertical className="w-3 h-3 mr-1.5 text-slate-400" />
          Drag items to reorder or move to other days
        </p>
      )}

      {!isCollapsed && (
        <ul className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
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

export default ItineraryDayCard;
