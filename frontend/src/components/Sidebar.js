import React from 'react';

export default function Sidebar({ open, filter, setFilter, priority, setPriority, stats, user, logout }) {
  const menuItems = [
    { label: 'All Tasks', value: 'all', icon: '◈', count: stats.total },
    { label: 'Active', value: 'active', icon: '◎', count: stats.active },
    { label: 'Completed', value: 'completed', icon: '✓', count: stats.completed },
  ];

  const initial = user?.name?.[0]?.toUpperCase() || '?';
  const colors = ['#7c5cfc', '#5eead4', '#f43f5e', '#f59e0b', '#10b981'];
  const avatarColor = colors[(user?.name?.charCodeAt(0) || 0) % colors.length];

  return (
    <aside style={{
      width: open ? 260 : 0,
      minWidth: open ? 260 : 0,
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10,10,20,0.7)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 5,
    }}>
      <div style={{ padding: '28px 20px 20px', opacity: open ? 1 : 0, transition: 'opacity 0.2s ease' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:36 }}>
          {/* <div style={{ width:34, height:34, background:'linear-gradient(135deg, #7c5cfc, #5eead4)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>T</div> */}
          <span style={{ fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:800, background:'linear-gradient(135deg, #f0eeff, #a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', whiteSpace:'nowrap' }}>Taskflow</span>
        </div>

        {/* Nav */}
        <p style={{ fontSize:10, fontWeight:600, color:'#3d3a52', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:10, paddingLeft:12 }}>WORKSPACE</p>
        <nav style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:28 }}>
          {menuItems.map(item => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 12px', borderRadius:12, width:'100%', textAlign:'left',
                background: filter === item.value ? 'rgba(124,92,252,0.12)' : 'transparent',
                border: `1px solid ${filter === item.value ? 'rgba(124,92,252,0.25)' : 'transparent'}`,
                color: filter === item.value ? '#a78bfa' : '#6b6580',
                fontSize:14, fontWeight:500, cursor:'pointer', transition:'all 0.2s ease',
                fontFamily:"'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { if (filter !== item.value) { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='#a09ab8'; }}}
              onMouseLeave={e => { if (filter !== item.value) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6b6580'; }}}
            >
              <span style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:16 }}>{item.icon}</span>
                {item.label}
              </span>
              {item.count > 0 && (
                <span style={{
                  background: filter === item.value ? 'rgba(124,92,252,0.3)' : 'rgba(255,255,255,0.06)',
                  color: filter === item.value ? '#a78bfa' : '#6b6580',
                  fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:50,
                }}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Priority Filter */}
        <p style={{ fontSize:10, fontWeight:600, color:'#3d3a52', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:10, paddingLeft:12 }}>PRIORITY</p>
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:28 }}>
          {[
            { value:'', label:'All Priorities', color:'#6b6580', dot:'rgba(255,255,255,0.2)' },
            { value:'high', label:'High Priority', color:'#f43f5e', dot:'#f43f5e' },
            { value:'medium', label:'Medium Priority', color:'#f59e0b', dot:'#f59e0b' },
            { value:'low', label:'Low Priority', color:'#10b981', dot:'#10b981' },
          ].map(p => (
            <button
              key={p.value}
              onClick={() => setPriority(p.value)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'9px 12px', borderRadius:10, width:'100%', textAlign:'left',
                background: priority === p.value ? `rgba(${p.value==='high'?'244,63,94':p.value==='medium'?'245,158,11':p.value==='low'?'16,185,129':'255,255,255'},0.08)` : 'transparent',
                border:'none', color: priority === p.value ? p.color : '#6b6580',
                fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.2s ease',
                fontFamily:"'DM Sans', sans-serif",
              }}
            >
              <span style={{ width:8, height:8, borderRadius:'50%', background: priority === p.value ? p.dot : 'rgba(255,255,255,0.15)', flexShrink:0 }} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Progress */}
        {stats.total > 0 && (
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'16px', marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ fontSize:12, color:'#a09ab8', fontWeight:500 }}>Progress</span>
              <span style={{ fontSize:12, color:'#7c5cfc', fontWeight:700 }}>
                {stats.total > 0 ? Math.round((stats.completed/stats.total)*100) : 0}%
              </span>
            </div>
            <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
              <div style={{
                height:'100%',
                width: `${stats.total > 0 ? (stats.completed/stats.total)*100 : 0}%`,
                background:'linear-gradient(90deg, #7c5cfc, #5eead4)',
                borderRadius:3, transition:'width 0.5s ease',
              }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
              <span style={{ fontSize:11, color:'#6b6580' }}>{stats.completed} done</span>
              <span style={{ fontSize:11, color:'#6b6580' }}>{stats.active} left</span>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div style={{
        marginTop:'auto',
        padding:'16px 20px',
        borderTop:'1px solid rgba(255,255,255,0.06)',
        display:'flex', alignItems:'center', gap:12,
        opacity: open ? 1 : 0, transition:'opacity 0.2s ease',
      }}>
        <div style={{ width:36, height:36, borderRadius:10, background:avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#fff', flexShrink:0 }}>
          {initial}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#f0eeff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</p>
          <p style={{ fontSize:11, color:'#6b6580', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
        </div>
        <button
          onClick={logout}
          title="Logout"
          style={{ width:62, height:32, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)', borderRadius:8, color:'#f43f5e', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(244,63,94,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(244,63,94,0.1)'; }}
        >Logout</button>
      </div>
    </aside>
  );
}
