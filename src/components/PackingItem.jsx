import React from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';

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

export default PackingItem;
