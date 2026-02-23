import React from 'react';

export default function StatsBar({ stats, completionPct }) {
  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: '◈', color: '#7c5cfc', bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.2)' },
    { label: 'Completed', value: stats.completed, icon: '✓', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    { label: 'Active', value: stats.active, icon: '◎', color: '#5eead4', bg: 'rgba(94,234,212,0.1)', border: 'rgba(94,234,212,0.2)' },
    { label: 'Completion', value: `${completionPct}%`, icon: '◐', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)', isPercent: true },
  ];

  return (
    <div style={{ padding:'20px 32px 0', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          style={{
            background: card.bg,
            border: `1px solid ${card.border}`,
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            animation: `fadeIn 0.4s ease ${i * 0.06}s both`,
          }}
        >
          <div style={{ width:40, height:40, borderRadius:12, background:'rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:card.color, flexShrink:0 }}>
            {card.icon}
          </div>
          <div>
            <p style={{ fontSize:22, fontWeight:800, fontFamily:"'Syne', sans-serif", color:card.color, lineHeight:1 }}>{card.value}</p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{card.label}</p>
          </div>
          {card.isPercent && stats.total > 0 && (
            <div style={{ marginLeft:'auto', flexShrink:0 }}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="3" />
                <circle cx="20" cy="20" r="16" fill="none" stroke="#a78bfa" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - completionPct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 20 20)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
