import React from 'react';

export default function StatusBadge({ status }) {
  const map = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-800';
  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${cls}`}>
      {status}
    </span>
  );
}
