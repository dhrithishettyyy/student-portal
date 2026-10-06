import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { 
  Home, CalendarDays, BookOpen, BarChart3, Settings, 
  RotateCw, ArrowRight 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user, logs, setIsRerouteModalOpen, subjects } = useApp();

  // Exactly the 5 requested core navigation items
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Home', icon: <Home size={18} /> },
    { id: 'study-plan', label: 'My Plan', icon: <CalendarDays size={18} /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen size={18} /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="app-sidebar">
      {/* GAMEY Brand Logo at Top of Sidebar */}
      <div 
        onClick={() => setActiveTab('dashboard')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          cursor: 'pointer',
          padding: '0 8px 24px 8px',
          borderBottom: '1px solid var(--game-border)',
          marginBottom: '16px'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(99, 102, 241, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          flexShrink: 0
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="6" r="2.5" />
            <circle cx="19" cy="18" r="2.5" />
            <path d="M5 8.5v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-1" />
            <polyline points="15 11 19 7 23 11" />
          </svg>
        </div>

        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            ReRoute
          </div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#A5B4FC', letterSpacing: '0.04em' }}>
            AI STUDY HUB
          </div>
        </div>
      </div>

      {/* Navigation Links (Matching GAMEY Menu) */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          letterSpacing: '0.08em', 
          color: 'var(--text-dim)', 
          padding: '6px 12px 8px', 
          textTransform: 'uppercase' 
        }}>
          Menu
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-sub)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid var(--game-primary)' : '3px solid transparent',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-sub)';
                }
              }}
            >
              <span style={{ color: isActive ? 'var(--game-primary)' : 'var(--text-dim)' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* GAMEY Communities / Active Courses Section */}
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--game-border)' }}>
          <div style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            letterSpacing: '0.08em', 
            color: 'var(--text-dim)', 
            padding: '0 12px 8px', 
            textTransform: 'uppercase' 
          }}>
            Courses
          </div>
          {subjects.slice(0, 4).map(s => (
            <button
              key={s.id}
              onClick={() => setActiveTab('subjects')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-sub)',
                cursor: 'pointer',
                width: '100%',
                fontSize: '0.84rem',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-sub)';
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color || '#6366F1' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Subdued ReRoute Guarantee Box at Bottom of Sidebar */}
      <div 
        style={{ 
          padding: '14px', 
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          marginTop: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <RotateCw size={14} color="#818CF8" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF' }}>
            Adaptive Engine
          </span>
        </div>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
          Missed a session? ReRoute automatically rebuilds your remaining week.
        </p>
        <button 
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '0.75rem', padding: '6px 8px' }}
          onClick={() => {
            if (logs.length > 0) {
              setIsRerouteModalOpen(true);
            } else {
              setActiveTab('study-plan');
            }
          }}
        >
          {user?.rerouteCountThisWeek ? `Rerouted ${user.rerouteCountThisWeek}x this week` : 'How ReRoute Works'}
        </button>
      </div>
    </aside>
  );
};
