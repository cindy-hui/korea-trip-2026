import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PackingCategoryCard from './PackingCategoryCard';

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

export default PackingTab;
