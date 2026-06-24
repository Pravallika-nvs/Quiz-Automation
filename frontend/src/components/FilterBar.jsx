import React from 'react';

export default function FilterBar({ filters, setFilters, categories = [], difficulties = [], onBulkDelete }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <input
        value={filters.search}
        onChange={e => update('search', e.target.value)}
        placeholder="Search by question..."
        className="px-3 py-2 border rounded w-full md:w-64"
      />

      <select value={filters.category} onChange={e => update('category', e.target.value)} className="px-3 py-2 border rounded">
        <option value="">All Categories</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select value={filters.difficulty} onChange={e => update('difficulty', e.target.value)} className="px-3 py-2 border rounded">
        <option value="">Any Difficulty</option>
        {difficulties.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">From</label>
        <input type="date" value={filters.fromDate || ''} onChange={e => update('fromDate', e.target.value)} className="px-3 py-2 border rounded" />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">To</label>
        <input type="date" value={filters.toDate || ''} onChange={e => update('toDate', e.target.value)} className="px-3 py-2 border rounded" />
      </div>

      <button onClick={onBulkDelete} className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Bulk Delete
      </button>
    </div>
  );
}
