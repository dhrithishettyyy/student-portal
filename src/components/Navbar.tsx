import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Clock, Award, User as UserIcon, ArrowRight, RotateCw } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { 
    user, 
    vibeStatus, 
    setActiveTab, 
    setIsRerouteModalOpen,
    latestRerouteLog,
    logs
  } = useApp();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(11, 15, 23, 0.95)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 35
    }}>
      {/* GAMEY Top Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '340px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--game-border)',
          width: '100%',
          transition: 'all 0.15s ease'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text"
            placeholder="Search subjects, quests, topics..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      {/* Center Status: Human, Not Robotic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Academic Status Check */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            background: vibeStatus === "YOU'RE COOKING" ? 'rgba(16, 185, 129, 0.08)' :
                        vibeStatus === "SLIGHTLY COOKED" ? 'rgba(239, 68, 68, 0.08)' :
                        'rgba(245, 158, 11, 0.08)',
            border: vibeStatus === "YOU'RE COOKING" ? '1px solid rgba(16, 185, 129, 0.25)' :
                    vibeStatus === "SLIGHTLY COOKED" ? '1px solid rgba(239, 68, 68, 0.25)' :
                    '1px solid rgba(245, 158, 11, 0.25)'
          }}
          title="Current study pacing"
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
            {vibeStatus === "YOU'RE COOKING" && '🔥 You\'re cooking.'}
            {vibeStatus === "GETTING THERE" && '👀 Getting there.'}
            {vibeStatus === "SLIGHTLY COOKED" && '💀 Slightly cooked.'}
          </span>
        </div>

        {/* Streak */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: '#FBBF24',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}
          title="Productive study streak"
        >
          <Flame size={15} color="#F59E0B" />
          <span>{user?.streak || 4}d Streak</span>
        </div>

        {/* Daily Capacity */}
        <div 
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
          title="Daily Study Hours Budget"
        >
          <Clock size={14} color="var(--text-muted)" />
          <span>{user?.availableStudyHours || 3}h / day</span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* ReRoute Recent Trigger if available */}
        {logs.length > 0 && (
          <button 
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => setIsRerouteModalOpen(true)}
            title="Inspect latest ReRoute transition"
          >
            <RotateCw size={13} color="#818CF8" />
            <span>Latest Reroute</span>
          </button>
        )}

        {/* Profile / Account */}
        <button 
          className="btn btn-secondary"
          style={{ fontSize: '0.84rem', padding: '7px 14px' }}
          onClick={onOpenAuth}
        >
          <UserIcon size={14} />
          <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
        </button>
      </div>
    </header>
  );
};
