import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, API } from '../context/AuthContext';
import toast from 'react-hot-toast';
import TodoCard from '../components/TodoCard';
import AddTodoModal from '../components/AddTodoModal';
import StatsBar from '../components/StatsBar';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, byPriority: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      const params = {};
      if (filter !== 'all') params.filter = filter;
      if (priority) params.priority = priority;
      if (search) params.search = search;
      const { data } = await API.get('/todos', { params });
      setTodos(data);
    } catch (err) {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [filter, priority, search]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get('/todos/stats');
      setStats(data);
    } catch (err) {}
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);
  useEffect(() => { fetchStats(); }, [todos.length, fetchStats]);

const handleToggle = async (id) => {
  try {
    const todo = todos.find(t => t._id === id);

    const { data } = await API.put(`/todos/${id}`, {
      completed: !todo.completed,
    });

    setTodos(prev =>
      prev.map(t => (t._id === id ? data : t))
    );

    fetchStats();
  } catch (error) {
    toast.error("Failed to update");
  }
};

  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
      fetchStats();
    } catch { toast.error('Failed to delete'); }
  };

  const handleSave = async (formData) => {
    try {
      if (editTodo) {
        const { data } = await API.put(`/todos/${editTodo._id}`, formData);
        setTodos(prev => prev.map(t => t._id === editTodo._id ? data : t));
        toast.success('Task updated ✨');
      } else {
        const { data } = await API.post('/todos', formData);
        setTodos(prev => [data, ...prev]);
        toast.success('Task created 🚀');
      }
      setShowModal(false);
      setEditTodo(null);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const openEdit = (todo) => { setEditTodo(todo); setShowModal(true); };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#07070f', position:'relative', overflow:'hidden' }}>
      {/* Background orbs */}
      <div style={{ position:'fixed', width:700, height:700, background:'radial-gradient(circle, rgba(124,92,252,0.07) 0%, transparent 70%)', top:'-20%', left:'30%', borderRadius:'50%', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', width:500, height:500, background:'radial-gradient(circle, rgba(94,234,212,0.05) 0%, transparent 70%)', bottom:'-10%', right:'10%', borderRadius:'50%', pointerEvents:'none', zIndex:0 }} />

      <Sidebar
        open={sidebarOpen}
        filter={filter}
        setFilter={setFilter}
        priority={priority}
        setPriority={setPriority}
        stats={stats}
        user={user}
        logout={logout}
      />

      {/* Main Content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, position:'relative', zIndex:1 }}>
        {/* Header */}
        <header style={{
          padding: '20px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(10px)',
          background: 'rgba(7,7,15,0.6)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ width:36, height:36, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#a09ab8', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}
            >☰</button>
            <div>
              <p style={{ fontSize:12, color:'#6b6580', fontWeight:500 }}>{getGreeting()},</p>
              <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:700, color:'#f0eeff' }}>{user?.name}</h1>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Search */}
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#6b6580', fontSize:14 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
                style={{
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:12, padding:'10px 16px 10px 36px', color:'#f0eeff', fontSize:14,
                  outline:'none', width:220, fontFamily:"'DM Sans', sans-serif",
                }}
              />
            </div>
            <button
              onClick={() => { setEditTodo(null); setShowModal(true); }}
              style={{
                display:'flex', alignItems:'center', gap:8,
                background:'linear-gradient(135deg, #7c5cfc 0%, #5b21b6 100%)',
                color:'#fff', border:'none', borderRadius:12,
                padding:'10px 20px', fontSize:14, fontWeight:600, cursor:'pointer',
                fontFamily:"'Syne', sans-serif",
                boxShadow:'0 4px 20px rgba(124,92,252,0.35)',
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(124,92,252,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(124,92,252,0.35)'; }}
            >
              <span style={{ fontSize:16 }}>+</span> New Task
            </button>
          </div>
        </header>

        {/* Stats Bar */}
        <StatsBar stats={stats} completionPct={completionPct} />

        {/* Todos */}
        <main style={{ flex:1, padding:'24px 32px', overflowY:'auto' }}>
          {/* Filter pills */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24, flexWrap:'wrap' }}>
            {['all','active','completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding:'7px 18px', borderRadius:50, fontSize:13, fontWeight:500,
                  background: filter === f ? 'linear-gradient(135deg, #7c5cfc, #5b21b6)' : 'rgba(255,255,255,0.04)',
                  color: filter === f ? '#fff' : '#6b6580',
                  border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  cursor:'pointer', transition:'all 0.2s ease',
                  fontFamily:"'DM Sans', sans-serif",
                  boxShadow: filter === f ? '0 2px 12px rgba(124,92,252,0.3)' : 'none',
                }}
              >{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
            <div style={{ height:20, width:1, background:'rgba(255,255,255,0.08)', margin:'0 4px' }} />
            {['','low','medium','high'].map(p => (
              <button
                key={p||'all-p'}
                onClick={() => setPriority(p)}
                style={{
                  padding:'7px 16px', borderRadius:50, fontSize:12, fontWeight:500,
                  background: priority === p ? (p === 'high' ? 'rgba(244,63,94,0.15)' : p === 'medium' ? 'rgba(245,158,11,0.15)' : p === 'low' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.03)',
                  color: priority === p ? (p === 'high' ? '#f43f5e' : p === 'medium' ? '#f59e0b' : p === 'low' ? '#10b981' : '#f0eeff') : '#6b6580',
                  border: `1px solid ${priority === p ? (p === 'high' ? 'rgba(244,63,94,0.3)' : p === 'medium' ? 'rgba(245,158,11,0.3)' : p === 'low' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.06)'}`,
                  cursor:'pointer', transition:'all 0.2s ease',
                  fontFamily:"'DM Sans', sans-serif",
                }}
              >{p ? `${p.charAt(0).toUpperCase()+p.slice(1)} Priority` : 'All Priority'}</button>
            ))}
            <span style={{ marginLeft:'auto', fontSize:13, color:'#6b6580' }}>
              {todos.length} task{todos.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height:100, background:'rgba(255,255,255,0.03)', borderRadius:16, border:'1px solid rgba(255,255,255,0.05)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)', animation:'shimmer 1.5s infinite' }} />
                </div>
              ))}
            </div>
          ) : todos.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 20px', animation:'fadeIn 0.4s ease' }}>
              
              <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:700, color:'#f0eeff', marginBottom:8 }}>
                {search ? 'No tasks found' : filter === 'completed' ? 'No completed tasks yet' : 'Your canvas is empty'}
              </h3>
              <p style={{ color:'#6b6580', fontSize:15, marginBottom:24 }}>
                {search ? 'Try a different search term' : 'Create your first task to get started'}
              </p>
              {!search && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{ padding:'12px 28px', background:'linear-gradient(135deg, #7c5cfc, #5b21b6)', color:'#fff', border:'none', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:"'Syne', sans-serif", boxShadow:'0 4px 20px rgba(124,92,252,0.3)' }}
                >Create First Task →</button>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {todos.map((todo, idx) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  index={idx}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <AddTodoModal
          todo={editTodo}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTodo(null); }}
        />
      )}
    </div>
  );
}
