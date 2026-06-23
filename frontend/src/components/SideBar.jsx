import React from 'react';

const MenuItem = ({ children, active }) => (
  <button
    className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-r-md transition-colors ${
      active ? 'bg-purple-600 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`}
  >
    {children}
  </button>
);

export default function SideBar({ active = 'Questions' }) {
  return (
    <aside className="w-56 bg-white h-screen fixed left-0 top-0 border-r shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-blue-600">Quiz Admin</h2>
      </div>
      <nav className="px-2 space-y-1">
        <MenuItem active={active === 'Dashboard'}>Dashboard</MenuItem>
        <MenuItem active={active === 'Config'}>Config</MenuItem>
        <MenuItem active={active === 'Questions'}>Questions</MenuItem>
        <MenuItem active={active === 'Logs'}>Logs</MenuItem>
      </nav>
    </aside>
  );
}
