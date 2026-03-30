import React from 'react';
import { Map, GripVertical, Trash2 } from 'lucide-react';

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

export default ItineraryItem;
