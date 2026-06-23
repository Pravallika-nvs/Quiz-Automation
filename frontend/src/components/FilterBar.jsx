import React from 'react';

export default function FilterBar({ filters, setFilters, categories = [], difficulties = [], statuses = [], onBulkDelete }) {
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

      <select value={filters.status} onChange={e => update('status', e.target.value)} className="px-3 py-2 border rounded">
        <option value="">Any Status</option>
        {statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button onClick={onBulkDelete} className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Bulk Delete
      </button>
    </div>
  );
}
