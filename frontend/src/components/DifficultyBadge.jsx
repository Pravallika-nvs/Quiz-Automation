import React from 'react';

export default function DifficultyBadge({ difficulty }) {
  const map = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };
  const cls = map[difficulty] || 'bg-slate-100 text-slate-800';
  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${cls}`}>
      {difficulty}
    </span>
  );
}
