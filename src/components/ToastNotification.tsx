import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCw, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, setToastMessage } = useApp();

  if (!toastMessage) return null;

  const isReroute = toastMessage.type === 'reroute';
  const isSuccess = toastMessage.type === 'success';

  return (
    <div 
      className="arcade-hud-card animate-fade-in"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 80,
        maxWidth: '380px',
        width: '90vw',
        padding: '16px 20px',
        borderLeft: isReroute ? '4px solid var(--neon-magenta)' : isSuccess ? '4px solid var(--neon-green)' : '4px solid var(--neon-orange)',
        background: 'rgba(12, 18, 34, 0.96)',
        boxShadow: isReroute ? '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(189, 0, 255, 0.35)' :
                   isSuccess ? '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 102, 0.35)' :
                   '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 119, 0, 0.35)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: isReroute ? 'rgba(192, 132, 252, 0.2)' : isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isReroute ? (
          <RotateCw size={17} color="#C084FC" />
        ) : isSuccess ? (
          <CheckCircle2 size={17} color="#10B981" />
        ) : (
          <AlertTriangle size={17} color="#F59E0B" />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '2px', fontWeight: 700 }}>
          {toastMessage.title}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {toastMessage.desc}
        </p>
      </div>

      <button
        onClick={() => setToastMessage(null)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          padding: '2px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
