import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyTask } from '../types';
import { Clock, Play, RotateCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { getTodayDateStr, getDateOffsetStr, formatDatePretty } from '../services/rerouteEngine';

export const StudyPlanView: React.FC = () => {
  const { 
    tasks, 
    completeTask, 
    missTask, 
    partialCompleteTask, 
    setActiveFocusTask, 
    setActiveTab, 
    user,
    rebuildSchedule,
    setIsRerouteModalOpen
  } = useApp();

  const todayStr = getTodayDateStr();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const availableDays = [0, 1, 2, 3, 4, 5, 6].map(offset => getDateOffsetStr(offset));

  const filteredTasks = tasks.filter(t => t.date === selectedDate);
  const totalMinutesForDay = filteredTasks.reduce((sum, t) => sum + (t.actualDuration || t.plannedDuration), 0);
  const totalHours = (totalMinutesForDay / 60).toFixed(1);

  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');
  const pendingTasks = filteredTasks.filter(t => t.status === 'Pending');
  const otherTasks = filteredTasks.filter(t => t.status === 'Missed' || t.status === 'Partially Completed');

  const defaultTimes = ['09:00 — 09:45', '10:00 — 11:00', '11:15 — 11:45', '14:00 — 14:45', '15:00 — 15:30'];

  const renderTaskRow = (task: StudyTask, idx: number) => {
    const isCompleted = task.status === 'Completed';
    const isMissed = task.status === 'Missed';
    const isPartial = task.status === 'Partially Completed';
    const timeSlot = defaultTimes[idx] || `Slot ${idx + 1}`;

    return (
      <div 
        key={task.id}
        className="timeline-row"
        style={{
          background: isCompleted ? 'rgba(16, 185, 129, 0.03)' :
                      isMissed ? 'rgba(239, 68, 68, 0.03)' :
                      isPartial ? 'rgba(245, 158, 11, 0.03)' : 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
          <div className="timeline-time">
            {timeSlot}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase' }}>
                {task.subjectName}
              </span>
              <span className={`badge ${
                task.priorityLevel === 'High' ? 'badge-high' :
                task.priorityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
              }`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                {task.priorityLevel}
              </span>

              {task.isMissedRescheduled && (
                <span className="badge badge-high" style={{ fontSize: '0.68rem' }}>
                  Rescheduled
                </span>
              )}
            </div>

            <div style={{
              fontSize: '0.96rem',
              fontWeight: 600,
              color: isCompleted ? 'var(--text-muted)' : '#FFFFFF',
              textDecoration: isCompleted ? 'line-through' : 'none',
              marginTop: '3px'
            }}>
              {task.topicName}
            </div>

            {task.priorityExplanation && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                💡 {task.priorityExplanation}
              </div>
            )}
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {task.plannedDuration} min
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.status === 'Pending' ? (
            <>
              <button 
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                onClick={() => {
                  setActiveFocusTask(task);
                  setActiveTab('focus-mode');
                }}
              >
                Start Studying
              </button>

              <button 
                className="btn btn-success"
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                onClick={() => completeTask(task.id)}
              >
                Mark Complete
              </button>

              <button 
                className="btn btn-amber"
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                onClick={() => partialCompleteTask(task.id, 50)}
              >
                Almost Done
              </button>

              <button 
                className="btn btn-danger"
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                onClick={() => missTask(task.id)}
              >
                Not Finished
              </button>
            </>
          ) : (
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: isCompleted ? '#34D399' : isMissed ? '#F87171' : '#FBBF24'
            }}>
              {isCompleted && '✓ Completed'}
              {isMissed && 'Missed · Rerouted 🔄'}
              {isPartial && 'Partial · Carried Over'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', color: '#FFFFFF', marginBottom: '4px' }}>
            My Study Plan
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Scheduled workload: <strong>{totalHours} hrs</strong> ({totalMinutesForDay} mins) · Daily limit: <strong>{user?.availableStudyHours || 3}h</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.82rem' }}
            onClick={() => setIsRerouteModalOpen(true)}
          >
            <RotateCw size={13} color="#818CF8" />
            View Reroute Transition
          </button>

          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.82rem' }}
            onClick={rebuildSchedule}
          >
            Rebalance Schedule
          </button>
        </div>
      </div>

      {/* Day Selector Pill Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '24px'
      }}>
        {availableDays.map(dateStr => {
          const isSelected = selectedDate === dateStr;
          const dayTasks = tasks.filter(t => t.date === dateStr);
          const dayMins = dayTasks.reduce((s, t) => s + (t.actualDuration || t.plannedDuration), 0);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: isSelected ? '1.5px solid var(--game-primary)' : '1px solid var(--game-border)',
                background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.02)',
                boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.2)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                minWidth: '125px',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : 'var(--text-sub)' }}>
                {formatDatePretty(dateStr)}
              </div>
              <div style={{ fontSize: '0.74rem', color: isSelected ? '#C7D2FE' : 'var(--text-dim)', marginTop: '3px' }}>
                {dayTasks.length} quests · {(dayMins / 60).toFixed(1)}h
              </div>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="surface-card" style={{ padding: '24px' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tasks scheduled for this date.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#60A5FA', marginBottom: '8px' }}>
                  Remaining Tasks ({pendingTasks.length})
                </div>
                <div className="timeline-container">
                  {pendingTasks.map((task, idx) => renderTaskRow(task, idx))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div style={{ borderTop: pendingTasks.length > 0 ? '1px solid var(--border-subtle)' : 'none', paddingTop: pendingTasks.length > 0 ? '16px' : '0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#34D399', marginBottom: '8px' }}>
                  Today's W's 🏆 ({completedTasks.length})
                </div>
                <div className="timeline-container">
                  {completedTasks.map((task, idx) => renderTaskRow(task, idx))}
                </div>
              </div>
            )}

            {/* Other / Missed / Partial */}
            {otherTasks.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F87171', marginBottom: '8px' }}>
                  Missed or Carried Over ({otherTasks.length})
                </div>
                <div className="timeline-container">
                  {otherTasks.map((task, idx) => renderTaskRow(task, idx))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
