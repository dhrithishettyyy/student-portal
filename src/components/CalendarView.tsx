import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, 
  AlertCircle, XCircle, Play, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getDateOffsetStr, formatDatePretty, getTodayDateStr } from '../services/rerouteEngine';

export const CalendarView: React.FC = () => {
  const { tasks, setActiveFocusTask, setActiveTab, user } = useApp();

  const todayStr = getTodayDateStr();
  const weekDays = [0, 1, 2, 3, 4, 5, 6].map(offset => getDateOffsetStr(offset));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-vibe">🗓️ Academic Timetable</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              7-Day Rolling Horizon
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF' }}>
            Calendar & Timetable
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Visual distribution of study tasks across upcoming days respecting your {user?.availableStudyHours || 3}h daily cap.
          </p>
        </div>
      </div>

      {/* Week Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        alignItems: 'start'
      }}>
        {weekDays.map(dateStr => {
          const isToday = dateStr === todayStr;
          const dayTasks = tasks.filter(t => t.date === dateStr);
          const totalMins = dayTasks.reduce((s, t) => s + (t.actualDuration || t.plannedDuration), 0);
          const totalHours = (totalMins / 60).toFixed(1);

          return (
            <div 
              key={dateStr}
              className="glass-panel"
              style={{
                padding: '16px',
                border: isToday ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
                background: isToday ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '380px'
              }}
            >
              {/* Day Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isToday ? '#818CF8' : '#FFFFFF' }}>
                    {formatDatePretty(dateStr)} {isToday && '🔥'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {dateStr}
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: totalMins > 180 ? '#F87171' : '#67E8F9' }}>
                  {totalHours}h / {user?.availableStudyHours || 3}h
                </span>
              </div>

              {/* Tasks within this day */}
              {dayTasks.length === 0 ? (
                <div style={{
                  padding: '24px 10px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)',
                  fontStyle: 'italic'
                }}>
                  No tasks scheduled
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dayTasks.map(task => {
                    const isCompleted = task.status === 'Completed';
                    const isMissed = task.status === 'Missed';
                    const isPartial = task.status === 'Partially Completed';

                    return (
                      <div 
                        key={task.id}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: isCompleted ? 'rgba(16, 185, 129, 0.1)' :
                                      isMissed ? 'rgba(239, 68, 68, 0.12)' :
                                      isPartial ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          borderLeft: task.priorityLevel === 'High' ? '3px solid #EF4444' :
                                      task.priorityLevel === 'Medium' ? '3px solid #F59E0B' : '3px solid #10B981'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#818CF8' }}>
                            {task.subjectName}
                          </span>
                          <span className={`badge ${
                            task.priorityLevel === 'High' ? 'badge-high' :
                            task.priorityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                          }`} style={{ fontSize: '0.64rem', padding: '1px 5px' }}>
                            {task.priorityLevel}
                          </span>
                        </div>

                        <div style={{
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          color: isCompleted ? 'var(--text-muted)' : '#FFFFFF',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          marginBottom: '6px'
                        }}>
                          {task.topicName}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} />
                            {task.plannedDuration}m
                          </span>

                          {task.status === 'Pending' && isToday ? (
                            <button
                              onClick={() => {
                                setActiveFocusTask(task);
                                setActiveTab('focus-mode');
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#10B981',
                                cursor: 'pointer',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <Play size={10} fill="#10B981" />
                              Lock In
                            </button>
                          ) : (
                            <span style={{
                              fontWeight: 700,
                              color: isCompleted ? '#34D399' : isMissed ? '#F87171' : isPartial ? '#FBBF24' : 'var(--text-dim)'
                            }}>
                              {task.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
