import React, { useMemo, useState } from 'react';
import SideBar from '../components/SideBar';
import StatsCard from '../components/StatsCard';
import FilterBar from '../components/FilterBar';

const sampleData = [
  { id: 1, text: 'What is React?', category: 'Frontend', difficulty: 'Easy', status: 'Approved' },
  { id: 2, text: 'Explain closures in JS', category: 'Programming', difficulty: 'Medium', status: 'Pending' },
  { id: 3, text: 'What is SQL injection?', category: 'Security', difficulty: 'Hard', status: 'Rejected' },
  { id: 4, text: 'Define polymorphism', category: 'Programming', difficulty: 'Easy', status: 'Approved' },
  { id: 5, text: 'What is Tailwind CSS?', category: 'Frontend', difficulty: 'Easy', status: 'Pending' },
];

const statusList = ['Pending', 'Approved', 'Rejected'];

export default function QuestionsPage() {
  const [data, setData] = useState(sampleData);
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '', status: '' });
  const [activeTab, setActiveTab] = useState('All');
  const [selected, setSelected] = useState(new Set());

  const categories = useMemo(() => Array.from(new Set(data.map(d => d.category))), [data]);
  const difficulties = useMemo(() => Array.from(new Set(data.map(d => d.difficulty))), [data]);

  const counts = useMemo(() => {
    const total = data.length;
    const pending = data.filter(d => d.status === 'Pending').length;
    const approved = data.filter(d => d.status === 'Approved').length;
    const rejected = data.filter(d => d.status === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [data]);

  const tabs = [
    { key: 'All', label: 'All', count: counts.total },
    { key: 'Pending', label: 'Pending', count: counts.pending },
    { key: 'Approved', label: 'Approved', count: counts.approved },
    { key: 'Rejected', label: 'Rejected', count: counts.rejected },
  ];

  const filtered = useMemo(() => {
    return data.filter(q => {
      if (activeTab !== 'All' && q.status !== activeTab) return false;
      if (filters.status && q.status !== filters.status) return false;
      if (filters.category && q.category !== filters.category) return false;
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
      if (filters.search && !q.text.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [data, filters, activeTab]);

  const toggleSelect = id => {
    setSelected(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const bulkDelete = () => {
    if (selected.size === 0) return;
    setData(prev => prev.filter(d => !selected.has(d.id)));
    setSelected(new Set());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SideBar active="Questions" />
      <main className="ml-56 p-8">
        <h1 className="text-3xl font-semibold text-slate-800">Quiz Generation System</h1>

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v6h6v-6c0-1.657-1.343-3-3-3z" /></svg>}
            count={counts.total}
            label="Total Questions"
          />
          <StatsCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            count={counts.pending}
            label="Pending"
          />
          <StatsCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12l4 4L19 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            count={counts.approved}
            label="Approved"
          />
          <StatsCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            count={counts.rejected}
            label="Rejected"
          />
        </section>

        <div className="mt-8">
          <div className="flex items-center gap-4 border-b pb-3">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-2 rounded-md -mb-px ${activeTab === t.key ? 'bg-purple-600 text-white' : 'text-slate-600'}`}
              >
                {t.label} <span className="text-sm text-slate-400">({t.count})</span>
              </button>
            ))}
          </div>

          <div className="mt-4 bg-white p-4 rounded shadow">
            <div className="mb-4">
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                difficulties={difficulties}
                statuses={['Pending', 'Approved', 'Rejected']}
                onBulkDelete={bulkDelete}
              />
            </div>

            <table className="w-full text-left">
              <thead className="text-sm text-slate-500">
                <tr>
                  <th className="py-2"><input type="checkbox" onChange={e => {
                    if (e.target.checked) setSelected(new Set(filtered.map(f => f.id)));
                    else setSelected(new Set());
                  }} checked={selected.size > 0 && selected.size === filtered.length} /></th>
                  <th className="py-2">Question</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Difficulty</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr key={q.id} className="border-t">
                    <td className="py-2"><input type="checkbox" checked={selected.has(q.id)} onChange={() => toggleSelect(q.id)} /></td>
                    <td className="py-2">{q.text}</td>
                    <td className="py-2">{q.category}</td>
                    <td className="py-2">{q.difficulty}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${q.status === 'Approved' ? 'bg-green-100 text-green-700' : q.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'}`}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">No questions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
