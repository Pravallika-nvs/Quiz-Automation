import React from 'react';
import DifficultyBadge from './DifficultyBadge';
import StatusBadge from './StatusBadge';
import ActionMenu from './ActionMenu';

function truncate(text, n = 60) {
  if (!text) return '';
  return text.length > n ? text.slice(0, n - 1) + '…' : text;
}

export default function QuestionRow({ q, checked, onToggle, onView, onEdit, onDelete }) {
  const date = new Date(q.date);
  const formatted = date.toLocaleDateString();

  return (
    <tr className="border-t">
  <td className="py-3 px-2 w-12">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onToggle(q.id)}
    />
  </td>

  <td className="py-3 px-2 font-medium">
    {q.id}
  </td>

  <td className="py-3 px-2">
    <div title={q.text} className="max-w-xl text-slate-800">
      {truncate(q.text)}
    </div>
  </td>

  <td className="py-3 px-2">{q.category}</td>

  <td className="py-3 px-2">
    <DifficultyBadge difficulty={q.difficulty} />
  </td>

  <td className="py-3 px-2">
    <StatusBadge status={q.status} />
  </td>

  <td className="py-3 px-2">
    {formatted}
  </td>

  <td className="py-3 px-2 w-24 text-right">
    <ActionMenu
      onView={() => onView(q)}
      onEdit={() => onEdit(q)}
      onDelete={() => onDelete(q)}
    />
  </td>
</tr>
  );
}
