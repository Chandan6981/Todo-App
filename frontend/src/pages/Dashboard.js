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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // FETCH TODOS
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

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ==============================
  // COMPUTED STATS (Frontend)
  // ==============================
  const computedStats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  const completionPct =
    computedStats.total > 0
      ? Math.round((computedStats.completed / computedStats.total) * 100)
      : 0;

  // TOGGLE TODO
  const handleToggle = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);

      const { data } = await API.put(`/todos/${id}`, {
        completed: !todo.completed,
      });

      setTodos(prev =>
        prev.map(t => (t._id === id ? data : t))
      );
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  // DELETE TODO
  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // CREATE / UPDATE TODO
  const handleSave = async (formData) => {
    try {
      if (editTodo) {
        const { data } = await API.put(`/todos/${editTodo._id}`, formData);
        setTodos(prev =>
          prev.map(t => t._id === editTodo._id ? data : t)
        );
        toast.success('Task updated ✨');
      } else {
        const { data } = await API.post('/todos', formData);
        setTodos(prev => [data, ...prev]);
        toast.success('Task created 🚀');
      }

      setShowModal(false);
      setEditTodo(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const openEdit = (todo) => {
    setEditTodo(todo);
    setShowModal(true);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#07070f' }}>

      <Sidebar
        open={sidebarOpen}
        filter={filter}
        setFilter={setFilter}
        priority={priority}
        setPriority={setPriority}
        stats={computedStats}
        user={user}
        logout={logout}
      />

      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <header style={{
          padding: '20px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          background: 'rgba(7,7,15,0.6)'
        }}>
          <div>
            <p style={{ fontSize:12, color:'#6b6580' }}>
              {getGreeting()},
            </p>
            <h1 style={{ fontSize:20, color:'#f0eeff' }}>
              {user?.name}
            </h1>
          </div>

          <button
            onClick={() => { setEditTodo(null); setShowModal(true); }}
            style={{
              background:'linear-gradient(135deg, #7c5cfc, #5b21b6)',
              color:'#fff',
              border:'none',
              borderRadius:12,
              padding:'10px 20px',
              cursor:'pointer'
            }}
          >
            + New Task
          </button>
        </header>

        {/* Stats Bar */}
        <StatsBar stats={computedStats} completionPct={completionPct} />

        {/* Todo List */}
        <main style={{ padding:'24px 32px' }}>
          {loading ? (
            <p style={{ color:'#6b6580' }}>Loading...</p>
          ) : todos.length === 0 ? (
            <p style={{ color:'#6b6580' }}>No tasks yet</p>
          ) : (
            todos.map((todo, idx) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                index={idx}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </main>
      </div>

      {showModal && (
        <AddTodoModal
          todo={editTodo}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditTodo(null);
          }}
        />
      )}
    </div>
  );
}
