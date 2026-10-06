import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  RotateCw, ArrowRight, ShieldCheck, CheckCircle2, 
  XCircle, Clock, Sparkles, RefreshCw, AlertTriangle, Layers, Calendar
} from 'lucide-react';
import { formatDatePretty } from '../services/rerouteEngine';

export const ReRouteAuditView: React.FC = () => {
  const { logs, rebuildSchedule, tasks, subjects, user } = useApp();

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '16px' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel-elevated"
        style={{
          padding: '28px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(20, 26, 46, 0.95) 0%, rgba(30, 41, 75, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-vibe" style={{ fontSize: '0.85rem' }}>
                ⭐ Core Innovation
              </span>
              <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
                ● Active Monitoring
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: '#FFFFFF', marginBottom: '8px' }}>
              Adaptive ReRoute Engine 🔄
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '680px', lineHeight: 1.5 }}>
              ReRoute is not just a timetable generator. Every time you finish, partially cook, or miss a task, 
              the engine dynamically re-weights priorities, recalculates remaining workload, and rebuilds future days.
            </p>
          </div>

          <button 
            className="btn btn-primary"
            onClick={rebuildSchedule}
            style={{ padding: '10px 20px' }}
          >
            <RefreshCw size={16} />
            Force Rebalance
          </button>
        </div>

        {/* The 6-Step Cycle Banner */}
        {/* PLAN → STUDY → TRACK → ANALYZE → REROUTE → IMPROVE */}
        <div style={{
          marginTop: '24px',
          padding: '14px 18px',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {['PLAN', 'STUDY', 'TRACK', 'ANALYZE', 'REROUTE', 'IMPROVE'].map((step, idx, arr) => (
            <React.Fragment key={step}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: step === 'REROUTE' ? '#C084FC' : '#FFFFFF',
                letterSpacing: '0.04em'
              }}>
                {step === 'REROUTE' && <RotateCw size={14} color="#C084FC" />}
                {step}
              </div>
              {idx < arr.length - 1 && (
                <ArrowRight size={14} color="var(--text-dim)" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Reroute History & Audit Trail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Left: Engine Rules & Safeguards */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#10B981" />
            Scheduling Safeguards
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Never Exceeds Study Hours:</strong> Caps study time strictly at {user?.availableStudyHours || 3}h/day to prevent burnout.
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>No Task Duplication:</strong> Completed workload is permanently retired. Missed work is cleanly relocated.
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Automatic Urgency Boost:</strong> Fumbled tasks receive a +20 to +25 priority surge to take tomorrow's #1 slot.
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Intelligent Load Shedding:</strong> Non-urgent tasks are shifted into later days when high-priority tasks spill over.
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Active ReRoute Metrics */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#818CF8" />
            Engine Statistics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Reroutes Executed</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{logs.length}</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Daily Study Cap</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#67E8F9' }}>{user?.availableStudyHours || 3} hrs</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Scheduled Days</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FBBF24' }}>7 Days</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Active Tasks</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>{tasks.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ReRoute Audit Log Timeline */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '6px' }}>
          Live ReRoute Audit Timeline
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Chronological record of every adaptive rebalance event and automatic schedule repair:
        </p>

        {logs.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No reroute events recorded yet. Complete or miss a task to see the engine in action!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {logs.map((log, index) => {
              const isFumble = log.triggerEvent.includes('Missed') || log.triggerEvent.includes('Fumbled');
              const isCooked = log.triggerEvent.includes('Completed') || log.triggerEvent.includes('✅');
              const isPartial = log.triggerEvent.includes('Partial');

              return (
                <div 
                  key={log.id || index}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderLeft: isFumble ? '4px solid #EF4444' :
                                isCooked ? '4px solid #10B981' :
                                isPartial ? '4px solid #F59E0B' : '4px solid #6366F1',
                    background: 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge ${
                        isFumble ? 'badge-high' : isCooked ? 'badge-low' : 'badge-medium'
                      }`}>
                        {log.triggerEvent}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>
                        {log.subjectTitle} — {log.taskTitle}
                      </strong>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      {log.timestamp}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {log.actionTaken}
                  </p>

                  {/* Summary Bullets */}
                  {log.changesSummary && log.changesSummary.length > 0 && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#A5B4FC', marginBottom: '6px' }}>
                        ENGINE ADJUSTMENTS:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {log.changesSummary.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gen-Z Quote */}
                  {log.genzQuote && (
                    <div style={{
                      fontSize: '0.8rem',
                      fontStyle: 'italic',
                      color: isFumble ? '#FCA5A5' : '#86EFAC',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Sparkles size={13} />
                      “{log.genzQuote}”
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
