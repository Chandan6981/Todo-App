import React, { useState, useEffect } from 'react';

export default function AddTodoModal({ todo, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', category: 'General', dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        category: todo.category || 'General',
        dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [todo]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    await onSave({ ...form, dueDate: form.dueDate || null });
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#f0eeff', fontSize: 14,
    outline: 'none', transition: 'all 0.2s ease',
    fontFamily: "'DM Sans', sans-serif",
  };

  const onFocus = e => {
    e.target.style.borderColor = 'rgba(124,92,252,0.5)';
    e.target.style.background = 'rgba(124,92,252,0.04)';
    e.target.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.08)';
  };
  const onBlur = e => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.background = 'rgba(255,255,255,0.04)';
    e.target.style.boxShadow = 'none';
  };

  const priorityOptions = [
    { value: 'low', label: '🟢 Low', color: '#10b981' },
    { value: 'medium', label: '🟡 Medium', color: '#f59e0b' },
    { value: 'high', label: '🔴 High', color: '#f43f5e' },
  ];

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'fadeIn 0.15s ease',
      }}
    >
      <div style={{
        background: '#0e0e1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: '36px',
        width: '100%', maxWidth: 520,
        boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        animation: 'fadeIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:700, color:'#f0eeff' }}>
              {todo ? 'Edit Task' : 'New Task'}
            </h2>
            <p style={{ fontSize:13, color:'#6b6580', marginTop:2 }}>
              {todo ? 'Update your task details' : 'Capture what needs to be done'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#6b6580', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(244,63,94,0.1)'; e.currentTarget.style.color='#f43f5e'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#6b6580'; }}
          >✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b6580', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>Task Title *</label>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="What needs to be done?" required
              style={{ ...inputStyle, fontSize:15 }}
              onFocus={onFocus} onBlur={onBlur}
              autoFocus
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b6580', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Add more details..."
              rows={3}
              style={{ ...inputStyle, resize:'vertical', lineHeight:1.5 }}
              onFocus={onFocus} onBlur={onBlur}
            />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            {/* Priority */}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b6580', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>Priority</label>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {priorityOptions.map(p => (
                  <button
                    key={p.value} type="button"
                    onClick={() => setForm({ ...form, priority: p.value })}
                    style={{
                      padding:'9px 14px', borderRadius:10, textAlign:'left', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s ease',
                      background: form.priority === p.value ? `rgba(${p.value==='high'?'244,63,94':p.value==='medium'?'245,158,11':'16,185,129'},0.12)` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form.priority === p.value ? p.color+'44' : 'rgba(255,255,255,0.07)'}`,
                      color: form.priority === p.value ? p.color : '#6b6580',
                      fontFamily:"'DM Sans', sans-serif",
                    }}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b6580', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>Category</label>
                <input
                  name="category" value={form.category} onChange={handleChange}
                  placeholder="e.g. Work, Personal"
                  style={inputStyle}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b6580', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>Due Date</label>
                <input
                  name="dueDate" type="date" value={form.dueDate} onChange={handleChange}
                  style={{ ...inputStyle, colorScheme:'dark' }}
                  onFocus={onFocus} onBlur={onBlur}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button
              type="button" onClick={onClose}
              style={{ flex:1, padding:'13px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#a09ab8', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans', sans-serif", transition:'all 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
            >Cancel</button>
            <button
              type="submit" disabled={loading || !form.title.trim()}
              style={{
                flex:2, padding:'13px',
                background: loading || !form.title.trim() ? 'rgba(124,92,252,0.4)' : 'linear-gradient(135deg, #7c5cfc, #5b21b6)',
                border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:600,
                cursor: loading || !form.title.trim() ? 'not-allowed' : 'pointer',
                fontFamily:"'Syne', sans-serif", boxShadow:'0 4px 20px rgba(124,92,252,0.25)',
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!loading && form.title.trim()) { e.currentTarget.style.boxShadow='0 8px 28px rgba(124,92,252,0.45)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='0 4px 20px rgba(124,92,252,0.25)'; e.currentTarget.style.transform='translateY(0)'; }}
            >
              {loading ? 'Saving...' : todo ? 'Update Task ✨' : 'Create Task 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
