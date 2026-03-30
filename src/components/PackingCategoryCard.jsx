import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import PackingItem from './PackingItem';

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

export default PackingCategoryCard;
