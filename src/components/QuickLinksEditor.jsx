import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

function QuickLinksEditor({ isOpen, onClose, links, onSave }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const [editedLinks, setEditedLinks] = useState([...links]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '', color: 'blue' });

  const colorOptions = [
    { name: 'Blue', value: 'blue', className: 'bg-blue-400' },
    { name: 'White', value: 'white', className: 'bg-white' },
    { name: 'Green', value: 'green', className: 'bg-green-400' },
    { name: 'Amber', value: 'amber', className: 'bg-amber-400' },
    { name: 'Rose', value: 'rose', className: 'bg-rose-400' },
    { name: 'Violet', value: 'violet', className: 'bg-violet-400' },
  ];

  useEffect(() => {
    setEditedLinks([...links]);
  }, [links]);

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    setEditedLinks([...editedLinks, { ...newLink }]);
    setNewLink({ title: '', url: '', icon: '' });
  };

  const handleEditLink = (index) => {
    setEditingIndex(index);
    const link = editedLinks[index];
    setNewLink({
      title: link.title,
      url: link.url,
      icon: link.icon,
      color: link.color || 'blue',
    });
  };

  const handleUpdateLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    const updated = [...editedLinks];
    updated[editingIndex] = { ...newLink };
    setEditedLinks(updated);
    setEditingIndex(null);
    setNewLink({ title: '', url: '', icon: '' });
  };

  const handleDeleteLink = (index) => {
    setEditedLinks(editedLinks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(editedLinks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer */}
      <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden flex flex-col p-6 shadow-2xl animate-slide-up">
        {/* Handle indicator for mobile */}
        <div className="flex justify-center pt-2 pb-3 sm:hidden">
          <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">Manage Quick Links</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Links List */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="space-y-2">
            {editedLinks.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No links added yet.</p>
            ) : (
              editedLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{link.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{link.title}</div>
                      <div className="text-xs text-slate-400 truncate">{link.url}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditLink(index)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(index)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="border-t border-slate-100 pt-4 flex-shrink-0">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            {editingIndex !== null ? 'Edit Link' : 'Add New Link'}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Title</label>
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="e.g., Notion Itinerary"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 mb-1 block">URL</label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Icon (emoji)</label>
              <input
                type="text"
                value={newLink.icon}
                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                placeholder="🌐"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                maxLength={2}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['🌐', '📍', '🧭', '✈️', '🍴', '🛍️', '🏠', 'ℹ️', '⭐', '❤️', '🎨'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewLink({ ...newLink, icon: emoji })}
                    className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-base">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Color</label>
              <div className="flex flex-wrap gap-1.5">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewLink({ ...newLink, color: color.value })}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      newLink.color === color.value
                        ? 'ring-2 ring-indigo-500 ring-offset-1'
                        : 'border-slate-200'
                    } ${color.className}`}
                    title={color.name}
                  >
                    <span className={`sr-only`}>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 flex-shrink-0">
          {editingIndex !== null ? (
            <>
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setNewLink({ title: '', url: '', icon: '' });
                }}
                className="flex-1 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLink}
                disabled={!newLink.title.trim() || !newLink.url.trim()}
                className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setNewLink({ title: '', url: '', icon: '', color: 'blue' })}
                className="flex-1 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleAddLink}
                disabled={!newLink.title.trim() || !newLink.url.trim()}
                className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Link
              </button>
            </>
          )}
        </div>

        {/* Save All Button */}
        <div className="mt-2 flex-shrink-0">
          <button
            onClick={handleSave}
            className="w-full py-2.5 text-sm font-medium bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 transition-colors"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default QuickLinksEditor;
