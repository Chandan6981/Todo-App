import React, { useState } from 'react';

const priorityConfig = {
  high: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.2)', label: 'High' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'Medium' },
  low: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', label: 'Low' },
};

export default function TodoCard({ todo, index, onToggle, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const p = priorityConfig[todo.priority] || priorityConfig.medium;

  const formatDate = (d) => {
    if (!d) return null;
    const date = new Date(d);
    const now = new Date();
    const diff = date - now;
    const overdue = diff < 0;
    if (overdue) return { text: `Overdue · ${date.toLocaleDateString()}`, color: '#f43f5e' };
    if (diff < 86400000) return { text: 'Due today', color: '#f59e0b' };
    if (diff < 172800000) return { text: 'Due tomorrow', color: '#f59e0b' };
    return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: '#6b6580' };
  };

  const due = formatDate(todo.dueDate);

  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => onDelete(todo._id), 200);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${todo.completed ? 'rgba(255,255,255,0.05)' : hovered ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        transition: 'all 0.2s ease',
        animation: `fadeIn 0.35s ease ${index * 0.04}s both`,
        opacity: deleting ? 0 : 1,
        transform: deleting ? 'scale(0.95)' : 'scale(1)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      {!todo.completed && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: `linear-gradient(to bottom, ${p.color}, transparent)`,
          borderRadius: '16px 0 0 16px',
          opacity: hovered ? 1 : 0.4,
          transition: 'opacity 0.2s ease',
        }} />
      )}

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo._id)}
        style={{
          width: 24, height: 24, borderRadius: 8, flexShrink: 0, marginTop: 2,
          background: todo.completed ? 'linear-gradient(135deg, #7c5cfc, #5eead4)' : 'transparent',
          border: `2px solid ${todo.completed ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: todo.completed ? '0 0 12px rgba(124,92,252,0.3)' : 'none',
        }}
        onMouseEnter={e => { if (!todo.completed) { e.currentTarget.style.borderColor='rgba(124,92,252,0.6)'; e.currentTarget.style.background='rgba(124,92,252,0.1)'; }}}
        onMouseLeave={e => { if (!todo.completed) { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.background='transparent'; }}}
      >
        {todo.completed && <span style={{ color:'#fff', fontSize:13, fontWeight:700, lineHeight:1 }}>✓</span>}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:4 }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 15, fontWeight: 600,
            color: todo.completed ? '#3d3a52' : '#f0eeff',
            textDecoration: todo.completed ? 'line-through' : 'none',
            transition: 'all 0.2s ease',
            lineHeight: 1.4,
            flex: 1, minWidth: 0,
          }}>{todo.title}</h3>
        </div>

        {todo.description && (
          <p style={{ fontSize:13, color:'#6b6580', marginBottom:10, lineHeight:1.5, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
            {todo.description}
          </p>
        )}

        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          {/* Priority badge */}
          <span style={{ fontSize:11, fontWeight:600, color:p.color, background:p.bg, border:`1px solid ${p.border}`, padding:'3px 10px', borderRadius:50 }}>
            {p.label}
          </span>

          {/* Category */}
          {todo.category && (
            <span style={{ fontSize:11, color:'#6b6580', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', padding:'3px 10px', borderRadius:50 }}>
              {todo.category}
            </span>
          )}

          {/* Due date */}
          {due && (
            <span style={{ fontSize:11, color:due.color, display:'flex', alignItems:'center', gap:4 }}>
              <span>📅</span> {due.text}
            </span>
          )}

          {/* Created */}
          <span style={{ fontSize:11, color:'#3d3a52', marginLeft:'auto' }}>
            {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', gap: 6, flexShrink: 0, marginTop: 2,
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(0)' : 'translateX(8px)',
        transition: 'all 0.2s ease',
      }}>
        <button
          onClick={() => onEdit(todo)}
          style={{ width:32, height:32, borderRadius:9, background:'rgba(124,92,252,0.1)', border:'1px solid rgba(124,92,252,0.2)', color:'#a78bfa', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(124,92,252,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(124,92,252,0.1)'; }}
          title="Edit"
        >✎</button>
        <button
          onClick={handleDelete}
          style={{ width:32, height:32, borderRadius:9, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.15)', color:'#f43f5e', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(244,63,94,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(244,63,94,0.08)'; }}
          title="Delete"
        >✕</button>
      </div>
    </div>
  );
}
