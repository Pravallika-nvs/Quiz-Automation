import React from 'react';

export default function StatsCard({ icon, count = 0, label }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{count}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}
