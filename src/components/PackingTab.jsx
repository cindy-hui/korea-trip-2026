// PackingTab.jsx
import React, { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// Child: PackingItem
function PackingItem({ item, onToggle, onChangeName, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(item.name);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempName.trim() !== item.name) {
      onChangeName(item.id, tempName);
    } else {
      setTempName(item.name);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
    else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempName(item.name);
    }
  };

  return (
    <div className="flex items-center gap-2 group">
      <button type="button" onClick={() => onToggle(item.id)} className="relative flex items-center justify-center cursor-pointer">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-indigo-400'}`}>
          {item.checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      {isEditing ? (
        <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="flex-1 text-sm bg-transparent border-b border-indigo-500 focus:outline-none text-slate-700" autoFocus />
      ) : (
        <button type="button" onClick={() => setIsEditing(true)} className={`flex-1 text-left text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
          {item.name}
        </button>
      )}

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove item">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// Child: PackingCategoryCard
function PackingCategoryCard({ category, items, onToggleItem, onChangeItemName, onAddItem, onRemoveItem, onRenameCategory, onRemoveCategory }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(category);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() !== category) {
      onRenameCategory(category, tempTitle.trim());
    } else {
      setTempTitle(category);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') handleTitleBlur();
    else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTempTitle(category);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-1">
          {isEditingTitle ? (
            <input type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} onBlur={handleTitleBlur} onKeyDown={handleTitleKeyDown} className="font-bold text-slate-800 bg-transparent border-b border-indigo-500 focus:outline-none text-sm" autoFocus />
          ) : (
            <button type="button" onClick={() => setIsEditingTitle(true)} className="font-bold text-slate-800 text-left text-sm hover:text-indigo-600">
              {category}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => { const id = onAddItem(category); }} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" aria-label="Add item">
            <Plus className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onRemoveCategory(category)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" aria-label="Remove category">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {items.map(item => (
          <PackingItem key={item.id} item={item} onToggle={onToggleItem} onChangeName={onChangeItemName} onRemove={onRemoveItem} />
        ))}
      </div>
    </div>
  );
}

// Main
export default function PackingTab({ packingList, setPackingList }) {
  const [activeEditId, setActiveEditId] = useState(null);

  const togglePackingItem = useCallback((category, itemId) => {
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  }, [setPackingList]);

  const updatePackingItemName = useCallback((category, id, value) => {
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === id ? { ...item, name: value } : item
      ),
    }));
  }, [setPackingList]);

  const addPackingItem = useCallback((category) => {
    const id = Date.now();
    setPackingList(prev => ({
      ...prev,
      [category]: [...prev[category], { id, name: '', checked: false }],
    }));
    return id;
  }, [setPackingList]);

  const removePackingItem = useCallback((category, id) => {
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id),
    }));
  }, [setPackingList]);

  const addPackingCategory = useCallback(() => {
    const baseName = 'New section';
    let name = baseName;
    let counter = 1;
    // avoid duplicate keys
    while (packingList[name]) {
      counter += 1;
      name = `${baseName} ${counter}`;
    }
    setPackingList(prev => ({ ...prev, [name]: [] }));
  }, [packingList]);

  const renamePackingCategory = useCallback((oldName, newName) => {
    if (!newName || oldName === newName || packingList[newName]) return;
    setPackingList(prev => {
      const { [oldName]: items, ...rest } = prev;
      return { ...rest, [newName]: items };
    });
  }, [packingList]);

  const removePackingCategory = useCallback((name) => {
    setPackingList(prev => {
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Packing Checklist</h2>
        <button type="button" onClick={addPackingCategory} className="text-xs font-medium text-indigo-500 hover:text-indigo-600 flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Add section
        </button>
      </div>
      {Object.entries(packingList).map(([category, items]) => (
        <PackingCategoryCard
          key={category}
          category={category}
          items={items}
          onToggleItem={togglePackingItem}
          onChangeItemName={updatePackingItemName}
          onAddItem={addPackingItem}
          onRemoveItem={removePackingItem}
          onRenameCategory={renamePackingCategory}
          onRemoveCategory={removePackingCategory}
        />
      ))}
    </div>
  );
}
