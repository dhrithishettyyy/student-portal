import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, Play, Clock, AlertCircle, Award, Sparkles, 
  CheckCircle2, ArrowRight, ShieldAlert, BarChart2 
} from 'lucide-react';
import { getDaysRemaining } from '../services/priorityEngine';

export const NextBestTaskView: React.FC = () => {
  const { nextBestTask, setActiveFocusTask, setActiveTab, topics, subjects } = useApp();

  if (!nextBestTask) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '700px', margin: '40px auto' }}>
        <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '8px' }}>
          All Caught Up! 🏆
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          You have completed all pending tasks for today. No urgent items require your attention.
        </p>
        <button className="btn btn-primary" onClick={() => setActiveTab('study-plan')}>
          View Upcoming Days
        </button>
      </div>
    );
  }

  const topicObj = topics.find(t => t.id === nextBestTask.topicId);
  const daysLeft = topicObj ? getDaysRemaining(topicObj.examDate) : 3;

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '16px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-vibe" style={{ fontSize: '0.82rem' }}>
            🎯 Single-Task Optimization
          </span>
          <span style={{ fontSize: '0.8rem', color: '#F87171', fontWeight: 600 }}>
            ● Recommended Next Action
          </span>
        </div>
        <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF' }}>
          Your Next Best Task
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Determined algorithmically to minimize deadline risk and optimize knowledge retention.
        </p>
      </div>

      {/* Featured Big Spotlight Card */}
      <div 
        className="glass-panel-elevated pulse-urgent"
        style={{
          padding: '36px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '28px',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          background: 'linear-gradient(135deg, rgba(25, 20, 36, 0.95) 0%, rgba(20, 26, 48, 0.95) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: 800, 
                color: '#818CF8', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {nextBestTask.subjectName}
              </span>
              <span className={`badge ${
                nextBestTask.priorityLevel === 'High' ? 'badge-high' :
                nextBestTask.priorityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
              }`}>
                🔴 {nextBestTask.priorityLevel} Priority ({nextBestTask.priorityScore}/100)
              </span>
            </div>

            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '10px' }}>
              {nextBestTask.topicName}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={15} color="#06B6D4" />
                <strong style={{ color: '#FFFFFF' }}>{nextBestTask.plannedDuration} min</strong> session
              </span>

              <span>•</span>

              <span>
                Difficulty: <strong style={{ color: '#FBBF24' }}>{nextBestTask.difficulty}</strong>
              </span>

              <span>•</span>

              <span>
                Exam in: <strong style={{ color: '#F87171' }}>{daysLeft <= 0 ? 'TODAY' : `${daysLeft} days`}</strong>
              </span>
            </div>
          </div>

          {/* Huge Action Button */}
          <button 
            className="btn btn-lockin"
            style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px' }}
            onClick={() => {
              setActiveFocusTask(nextBestTask);
              setActiveTab('focus-mode');
            }}
          >
            <Play size={18} fill="#FFFFFF" />
            🔒 LOCK IN NOW
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Current Topic Mastery:</span>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{topicObj?.progress || 35}%</span>
          </div>
          <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${topicObj?.progress || 35}%`,
              background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 100%)'
            }} />
          </div>
        </div>

        {/* Why Now Explanation Badge (Section 9 Requirement) */}
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 800, color: '#F87171', marginBottom: '4px' }}>
            <Sparkles size={15} />
            Why now?
          </div>
          <p style={{ fontSize: '0.88rem', color: '#FEE2E2', lineHeight: 1.4 }}>
            {nextBestTask.priorityExplanation || "Your exam is approaching and this topic has low progress."}
          </p>
        </div>
      </div>

      {/* Mathematical Breakdown of the Score */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={18} color="#818CF8" />
          Transparent Priority Score Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Deadline Urgency</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F87171' }}>35 / 40 pts</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Exam in {daysLeft} days</div>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Difficulty Weight</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FBBF24' }}>
              {nextBestTask.difficulty === 'Hard' ? '25 / 25 pts' : '15 / 25 pts'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{nextBestTask.difficulty} complexity</div>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Progress Gap</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#67E8F9' }}>
              {Math.round(((100 - (topicObj?.progress || 35)) / 100) * 25)} / 25 pts
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{100 - (topicObj?.progress || 35)}% unfinished</div>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Overall Priority</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>{nextBestTask.priorityScore} / 100</div>
            <div style={{ fontSize: '0.72rem', color: '#818CF8' }}>{nextBestTask.priorityLevel} Classification</div>
          </div>
        </div>
      </div>
    </div>
  );
};
