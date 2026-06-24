import React, { useState, useRef, useEffect } from 'react';

export default function ActionMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(s => !s)} className="p-1 rounded hover:bg-slate-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
          <button onClick={() => { setOpen(false); onView(); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">View</button>
          <button onClick={() => { setOpen(false); onEdit(); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Edit</button>
          <button onClick={() => { setOpen(false); onDelete(); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-50">Delete</button>
        </div>
      )}
    </div>
  );
}
