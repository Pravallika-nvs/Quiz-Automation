import React, { useMemo, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import StatsCard from '../components/StatsCard';
import QuestionsTable from '../components/QuestionsTable';

// Mock JSON data (20+ questions) with date fields
const mockData = [
  { id: 1, text: 'What is React and why use it?', category: 'Frontend', difficulty: 'Easy', status: 'Approved', date: '2026-06-22T10:12:00Z' },
  { id: 2, text: 'Explain closures in JavaScript with an example.', category: 'Programming', difficulty: 'Medium', status: 'Pending', date: '2026-06-21T09:00:00Z' },
  { id: 3, text: 'What is SQL injection and how to prevent it?', category: 'Security', difficulty: 'Hard', status: 'Rejected', date: '2026-06-20T12:30:00Z' },
  { id: 4, text: 'Define polymorphism in OOP.', category: 'Programming', difficulty: 'Easy', status: 'Approved', date: '2026-06-19T14:20:00Z' },
  { id: 5, text: 'What is Tailwind CSS and utility-first approach?', category: 'Frontend', difficulty: 'Easy', status: 'Pending', date: '2026-06-18T08:45:00Z' },
  { id: 6, text: 'Explain event delegation in JavaScript.', category: 'Frontend', difficulty: 'Medium', status: 'Approved', date: '2026-06-17T11:11:00Z' },
  { id: 7, text: 'Describe the HTTP request lifecycle.', category: 'Networking', difficulty: 'Medium', status: 'Pending', date: '2026-06-16T15:00:00Z' },
  { id: 8, text: 'What is CORS and how does it work?', category: 'Security', difficulty: 'Medium', status: 'Approved', date: '2026-06-15T10:00:00Z' },
  { id: 9, text: 'Explain promises versus async/await.', category: 'Programming', difficulty: 'Medium', status: 'Pending', date: '2026-06-14T09:30:00Z' },
  { id: 10, text: 'What are RESTful APIs and principles?', category: 'Backend', difficulty: 'Easy', status: 'Approved', date: '2026-06-13T13:00:00Z' },
  { id: 11, text: 'How does garbage collection work in JS engines?', category: 'Programming', difficulty: 'Hard', status: 'Pending', date: '2026-06-12T07:45:00Z' },
  { id: 12, text: 'Explain normalization in relational databases.', category: 'Database', difficulty: 'Medium', status: 'Approved', date: '2026-06-11T16:20:00Z' },
  { id: 13, text: 'Describe the CAP theorem.', category: 'Database', difficulty: 'Hard', status: 'Rejected', date: '2026-06-10T12:00:00Z' },
  { id: 14, text: 'What is functional programming?', category: 'Programming', difficulty: 'Easy', status: 'Approved', date: '2026-06-09T10:10:00Z' },
  { id: 15, text: 'Explain how web sockets work.', category: 'Networking', difficulty: 'Medium', status: 'Pending', date: '2026-06-08T09:05:00Z' },
  { id: 16, text: 'What is a closure and where is it useful?', category: 'Programming', difficulty: 'Medium', status: 'Approved', date: '2026-06-07T14:22:00Z' },
  { id: 17, text: 'How to secure REST APIs?', category: 'Security', difficulty: 'Hard', status: 'Pending', date: '2026-06-06T18:00:00Z' },
  { id: 18, text: 'What are design patterns? Give examples.', category: 'Architecture', difficulty: 'Medium', status: 'Approved', date: '2026-06-05T11:11:00Z' },
  { id: 19, text: 'Explain event loop in Node.js.', category: 'Backend', difficulty: 'Hard', status: 'Rejected', date: '2026-06-04T08:30:00Z' },
  { id: 20, text: 'What is responsive design?', category: 'Frontend', difficulty: 'Easy', status: 'Approved', date: '2026-06-03T12:55:00Z' },
  { id: 21, text: 'How to optimize SQL queries for performance?', category: 'Database', difficulty: 'Hard', status: 'Pending', date: '2026-06-02T10:00:00Z' },
];

export default function QuestionsPage() {
  const [data, setData] = useState(mockData);
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '', fromDate: '', toDate: '' });
  const [activeTab, setActiveTab] = useState('All');
  const [selected, setSelected] = useState(new Set());
  //const navigate = useNavigate();

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
                onClick={() => {
                  setActiveTab(t.key);
                  setFilters({ search: '', category: '', difficulty: '', fromDate: '', toDate: '' });
                  setSelected(new Set());
                }}
                className={`px-3 py-2 rounded-md -mb-px ${activeTab === t.key ? 'bg-purple-600 text-white' : 'text-slate-600'}`}
              >
                {t.label} <span className="text-sm text-slate-400">({t.count})</span>
              </button>
            ))}
          </div>

          <div className="mt-4 bg-white p-4 rounded shadow">
            <QuestionsTable
              data={data}
              activeTab={activeTab}
              filters={filters}
              setFilters={setFilters}
              selected={selected}
              setSelected={setSelected}
              onDelete={(id) => setData(prev => prev.filter(p => p.id !== id))}
              onEditNavigate={(item) => navigate(`/questions/${item.id}`)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
