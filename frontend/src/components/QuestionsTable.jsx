import React, { useMemo, useState, useEffect } from 'react';
import QuestionRow from './QuestionRow';
import FilterBar from './FilterBar';

export default function QuestionsTable({ data, activeTab, filters, setFilters, selected, setSelected, onDelete, onEditNavigate }) {
  const [viewItem, setViewItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    // when activeTab changes, parent should clear filters and selected; ensure table-level side-effects if needed
  }, [activeTab]);

  const filtered = useMemo(() => {
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    return data
      .filter(q => {
        if (activeTab !== 'All' && q.status !== activeTab) return false;
        if (filters.category && q.category !== filters.category) return false;
        if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
        if (filters.search && !q.text.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (from && new Date(q.date) < from) return false;
        if (to && new Date(q.date) > new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data, filters, activeTab]);

  const toggleSelect = id => {
    setSelected(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const selectAll = (checked) => {
    if (checked) setSelected(new Set(filtered.map(f => f.id)));
    else setSelected(new Set());
  };

  const handleDelete = (q) => {
    setConfirmDelete(q);
  };

  const confirmDeleteNow = () => {
    if (!confirmDelete) return;
    onDelete(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div>
      <div className="mb-4">
        <FilterBar filters={filters} setFilters={setFilters} categories={Array.from(new Set(data.map(d=>d.category)))} difficulties={Array.from(new Set(data.map(d=>d.difficulty)))} onBulkDelete={() => { if (selected.size) { selected.forEach(id => onDelete(id)); setSelected(new Set()); } }} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="text-sm text-slate-500">
            <tr>
              <th className="py-2 px-2"><input type="checkbox" onChange={e => selectAll(e.target.checked)} checked={filtered.length > 0 && selected.size === filtered.length} /></th>
              <th className="py-2 px-2">QID</th>
              <th className="py-2 px-2">Question</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Difficulty</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => (
              <QuestionRow key={q.id} q={q} checked={selected.has(q.id)} onToggle={toggleSelect} onView={(item) => setViewItem(item)} onEdit={(item) => onEditNavigate(item)} onDelete={(item) => handleDelete(item)} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">No questions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30">
          <div className="bg-white rounded p-6 w-11/12 max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">Question Details</h2>
            <div className="mb-4 text-slate-800">{viewItem.text}</div>
            <div className="text-sm text-slate-600">Category: {viewItem.category}</div>
            <div className="text-sm text-slate-600">Difficulty: {viewItem.difficulty}</div>
            <div className="text-sm text-slate-600">Status: {viewItem.status}</div>
            <div className="text-sm text-slate-600">Date: {new Date(viewItem.date).toLocaleString()}</div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setViewItem(null)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="mt-2 text-slate-600">Are you sure you want to delete this question?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-2 border rounded">Cancel</button>
              <button onClick={confirmDeleteNow} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
