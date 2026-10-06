import React from 'react';
import { RotateCw, ArrowDown, ArrowRight, X, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { ReRouteLog } from '../types';

interface RerouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPlan: () => void;
  latestLog: ReRouteLog | null;
}

export const RerouteModal: React.FC<RerouteModalProps> = ({
  isOpen,
  onClose,
  onViewPlan,
  latestLog
}) => {
  if (!isOpen || !latestLog) return null;

  const isFumble = latestLog.triggerEvent.includes('Missed') || latestLog.triggerEvent.includes('Fumbled');
  const isPartial = latestLog.triggerEvent.includes('Partial');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 14, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 90,
      padding: '20px'
    }}>
      <div 
        className="surface-card-hero"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '32px',
          position: 'relative'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RotateCw size={18} color="#818CF8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                🔄 Plan Rerouted
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {isFumble ? "You fumbled. We rerouted. 🫡" : "Your comeback plan is ready. 🚀"}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Task Identifier */}
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#818CF8', fontWeight: 700 }}>
            {latestLog.subjectTitle}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
            {latestLog.taskTitle}
          </div>
          <div style={{ fontSize: '0.8rem', color: isFumble ? '#FCA5A5' : '#94A3B8', marginTop: '2px' }}>
            {isFumble ? "You missed this scheduled session." : latestLog.actionTaken}
          </div>
        </div>

        {/* Before → ReRoute Engine → Updated Transition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {/* 1. Before */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '3px solid #64748B'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Before
            </div>
            <div style={{ fontSize: '0.84rem', color: '#E2E8F0', marginTop: '2px' }}>
              {latestLog.beforeOverview || "60 min previously scheduled"}
            </div>
          </div>

          {/* Down Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8', padding: '2px 0' }}>
            <ArrowDown size={16} />
          </div>

          {/* 2. ReRoute Action */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderLeft: '3px solid #6366F1'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#A5B4FC', textTransform: 'uppercase', fontWeight: 700 }}>
              ReRoute Analysis
            </div>
            <div style={{ fontSize: '0.84rem', color: '#FFFFFF', marginTop: '2px' }}>
              Analyzed deadline urgency + remaining workload + daily study hours cap...
            </div>
          </div>

          {/* Down Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', padding: '2px 0' }}>
            <ArrowDown size={16} />
          </div>

          {/* 3. Updated Plan */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.08)',
            borderLeft: '3px solid #10B981'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 700 }}>
              Updated Schedule
            </div>
            <div style={{ fontSize: '0.84rem', color: '#FFFFFF', marginTop: '2px' }}>
              {latestLog.afterOverview || "Rescheduled into tomorrow's priority slot with zero overload"}
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button 
          className="btn btn-hero"
          style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
          onClick={() => {
            onClose();
            onViewPlan();
          }}
        >
          View Updated Plan →
        </button>
      </div>
    </div>
  );
};
