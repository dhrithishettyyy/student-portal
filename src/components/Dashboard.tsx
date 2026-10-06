import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, Flame
} from 'lucide-react';
import { getDaysRemaining } from '../services/priorityEngine';
import { getTodayDateStr } from '../services/rerouteEngine';

export const Dashboard: React.FC = () => {
  const { 
    user, 
    nextBestTask, 
    vibeStatus, 
    tasks, 
    subjects, 
    topics, 
    setActiveFocusTask, 
    setActiveTab, 
    completeTask, 
    missTask, 
    partialCompleteTask,
    aiInsights,
    academicGlowUp,
    userLevel
  } = useApp();

  const todayStr = getTodayDateStr();
  const todayTasks = tasks.filter(t => t.date === todayStr);

  const heroTask = nextBestTask || todayTasks[0];
  const heroTopic = heroTask ? topics.find(t => t.id === heroTask.topicId) : null;
  const heroDaysLeft = heroTopic ? getDaysRemaining(heroTopic.examDate) : 3;

  // Upcoming Deadlines sorted by urgency
  const upcomingDeadlines = [...topics]
    .map(topic => {
      const subj = subjects.find(s => s.id === topic.subjectId);
      return {
        topic,
        subjectName: subj?.name || 'General',
        daysLeft: getDaysRemaining(topic.examDate)
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  // Time slot labels for the clean timeline view
  const defaultTimeSlots = [
    '09:00 — 09:45',
    '10:00 — 11:00',
    '11:15 — 11:45',
    '14:00 — 14:45',
    '15:00 — 15:30'
  ];

  // Video game HUD meter (Health / Mana / XP bar style)
  const renderHudMeter = (percentage: number, colorType: 'cyan' | 'green' | 'orange' = 'cyan', height: number = 10) => {
    return (
      <div className="hud-meter-frame" style={{ width: '100%' }}>
        <div className="hud-meter-track" style={{ height: `${height}px` }}>
          <div 
            className={colorType === 'green' ? 'hud-hp-bar' : colorType === 'orange' ? 'hud-xp-bar' : 'hud-mana-bar'}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      </div>
    );
  };

  // Subject world icons
  const getSubjectWorldIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('dbms') || lower.includes('database')) return '📚';
    if (lower.includes('java') || lower.includes('code') || lower.includes('prog')) return '🧩';
    if (lower.includes('ai') || lower.includes('ml') || lower.includes('intelligence')) return '🧠';
    if (lower.includes('structure') || lower.includes('algo')) return '⚙️';
    return '📦';
  };

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
      {/* 1. GAMEY Header: Student Command Hub */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge" style={{ 
              background: 'rgba(99, 102, 241, 0.15)', 
              color: '#A5B4FC', 
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '0.74rem'
            }}>
              MISSION COMMAND
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
              Adaptive AI Study Engine
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Good morning, {user ? user.name.split(' ')[0] : 'Student'} 👋
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-sub)', fontWeight: 500 }}>
            Here is your personalized academic roadmap for today.
          </p>
        </div>

        {/* Academic XP & Streak Gaming Pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="badge badge-xp" style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 800 }}>
              ⚡ {user?.xp || 640} XP · {userLevel.title}
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--game-amber)'
              }}
            >
              <Flame size={15} color="#F59E0B" />
              <span>{user?.streak || 4}d Streak</span>
            </div>
          </div>
          {/* Gaming XP Progress Bar */}
          <div style={{ width: '200px' }}>
            {renderHudMeter(Math.round(((user?.xp || 640) % 500) / 5), 'orange', 7)}
          </div>
        </div>
      </div>

      {/* 2. CENTRAL HERO SHOWCASE: TODAY'S MOVE (GAMEY Featured Banner Style) */}
      {heroTask ? (
        <section 
          className="hud-hero-card" 
          style={{ 
            padding: '36px 38px', 
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge" style={{ 
                background: 'rgba(99, 102, 241, 0.2)', 
                color: '#C7D2FE',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                fontSize: '0.76rem',
                fontWeight: 800
              }}>
                ⭐ ACTIVE QUEST
              </span>
              <span className={`badge ${
                heroTask.priorityLevel === 'High' ? 'badge-high' :
                heroTask.priorityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
              }`}>
                {heroTask.priorityLevel} Priority
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              RECOMMENDED NEXT MOVE
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '28px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#818CF8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>{getSubjectWorldIcon(heroTask.subjectName)}</span>
                <span>{heroTask.subjectName}</span>
              </div>

              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px', lineHeight: 1.15 }}>
                {heroTask.topicName}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: '18px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={15} color="#818CF8" />
                  <strong style={{ color: '#FFFFFF' }}>{heroTask.plannedDuration} min</strong>
                </span>
                <span>·</span>
                <span>Exam in <strong style={{ color: heroDaysLeft <= 3 ? '#FB7185' : '#FFFFFF' }}>{heroDaysLeft <= 0 ? 'TODAY' : `${heroDaysLeft} days`}</strong></span>
                <span>·</span>
                <span>Mastery: <strong style={{ color: '#A5B4FC' }}>{heroTopic?.progress || 35}%</strong></span>
              </div>

              {/* Gaming Topic Mastery Bar (Mana / Focus style) */}
              <div style={{ maxWidth: '420px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-sub)' }}>TOPIC MASTERY</span>
                  <span style={{ color: '#818CF8', fontWeight: 700 }}>{heroTopic?.progress || 35}%</span>
                </div>
                {renderHudMeter(heroTopic?.progress || 35, 'cyan', 10)}
              </div>

              {/* Natural, Human Explanation Badge */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                maxWidth: '640px'
              }}>
                <span style={{ fontSize: '0.84rem', color: '#C7D2FE', lineHeight: 1.45 }}>
                  <strong style={{ color: '#FFFFFF' }}>Why this task?</strong> {
                    heroDaysLeft <= 3 
                      ? `Your ${heroTask.subjectName} exam is approaching in ${heroDaysLeft} days and progress is currently at ${heroTopic?.progress || 35}%.`
                      : (heroTask.priorityExplanation || "Highest urgency-to-progress ratio in your current syllabus.")
                  }
                </span>
              </div>
            </div>

            {/* GAMEY Signature Primary Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignSelf: 'center' }}>
              <button 
                className="btn btn-hero"
                style={{ padding: '16px 36px', fontSize: '1.05rem' }}
                onClick={() => {
                  setActiveFocusTask(heroTask);
                  setActiveTab('focus-mode');
                }}
              >
                ▶ Start Session
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="arcade-hud-card" style={{ padding: '36px', textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '8px' }}>
            All finished for today! 🏆
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '18px' }}>
            You've completed all scheduled tasks. Review upcoming days whenever you're ready.
          </p>
          <button className="btn btn-secondary" onClick={() => setActiveTab('study-plan')}>
            View Full Plan
          </button>
        </section>
      )}

      {/* 2.5 GAMEY "POPULAR GAME" STYLE: ACTIVE COURSES & QUESTS */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)' }}>
              COURSE PORTFOLIO
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0 0' }}>
              Active Subjects
            </h3>
          </div>
          <button 
            className="btn btn-ghost" 
            style={{ fontSize: '0.8rem', color: '#818CF8' }}
            onClick={() => setActiveTab('subjects')}
          >
            Manage Courses →
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '16px' 
        }}>
          {subjects.map((s, idx) => {
            const subTopics = topics.filter(t => t.subjectId === s.id);
            const avg = subTopics.length > 0 
              ? Math.round(subTopics.reduce((a, b) => a + b.progress, 0) / subTopics.length)
              : 0;
            const completedCount = subTopics.filter(t => t.progress >= 100).length;

            // Palette per card (gaming themes)
            const gradients = [
              'linear-gradient(135deg, rgba(99, 102, 241, 0.45) 0%, rgba(139, 92, 246, 0.15) 100%)',
              'linear-gradient(135deg, rgba(6, 182, 212, 0.45) 0%, rgba(59, 130, 246, 0.15) 100%)',
              'linear-gradient(135deg, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.15) 100%)',
              'linear-gradient(135deg, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.15) 100%)'
            ];
            const cardBg = gradients[idx % gradients.length];

            return (
              <div 
                key={s.id}
                onClick={() => setActiveTab('subjects')}
                className="game-card"
                style={{
                  background: 'var(--game-surface)',
                  borderRadius: '14px',
                  border: '1px solid var(--game-border)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--game-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Game Art Banner Header */}
                <div style={{
                  height: '76px',
                  background: cardBg,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
                    {getSubjectWorldIcon(s.name)}
                  </span>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    background: 'rgba(0, 0, 0, 0.55)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    {subTopics.length} TOPICS
                  </span>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </h4>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)', marginBottom: '12px' }}>
                      {completedCount} / {subTopics.length} topics mastered
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '5px' }}>
                      <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>MASTERY</span>
                      <span style={{ color: avg >= 70 ? '#34D399' : '#818CF8', fontWeight: 800 }}>{avg}%</span>
                    </div>
                    {renderHudMeter(avg, avg >= 70 ? 'green' : 'cyan', 6)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SIMPLIFIED TIMELINE: Today's Plan */}
      <section className="arcade-hud-card" style={{ padding: '22px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>
              Today's Plan
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
              Structured study timeline adhering to your {user?.availableStudyHours || 3}h daily limit
            </span>
          </div>

          <button 
            className="btn btn-ghost" 
            style={{ fontSize: '0.8rem' }}
            onClick={() => setActiveTab('study-plan')}
          >
            View Full Week →
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.84rem' }}>
            No tasks left for today.
          </div>
        ) : (
          <div className="timeline-container">
            {todayTasks.map((task, idx) => {
              const isCompleted = task.status === 'Completed';
              const isMissed = task.status === 'Missed';
              const isPartial = task.status === 'Partially Completed';
              const timeSlot = defaultTimeSlots[idx] || `Slot ${idx + 1}`;

              return (
                <div 
                  key={task.id} 
                  className="timeline-row"
                  style={{
                    background: isCompleted ? 'rgba(16, 185, 129, 0.03)' :
                                isMissed ? 'rgba(239, 68, 68, 0.04)' :
                                isPartial ? 'rgba(245, 158, 11, 0.03)' : 'transparent'
                  }}
                >
                  {/* Left: Time & Subject */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                    <div className="timeline-time">
                      {timeSlot}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem' }}>{getSubjectWorldIcon(task.subjectName)}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase' }}>
                          {task.subjectName}
                        </span>
                        <span className={`badge ${
                          task.priorityLevel === 'High' ? 'badge-high' :
                          task.priorityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                        }`} style={{ fontSize: '0.66rem', padding: '1px 5px' }}>
                          {task.priorityLevel}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: isCompleted ? 'var(--text-dim)' : '#FFFFFF',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        marginTop: '2px'
                      }}>
                        {task.topicName}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Duration */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                    {task.plannedDuration} min
                  </div>

                  {/* Right: Human Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {task.status === 'Pending' ? (
                      <>
                        <button 
                          className="btn btn-primary"
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                          onClick={() => {
                            setActiveFocusTask(task);
                            setActiveTab('focus-mode');
                          }}
                        >
                          Start
                        </button>

                        <button 
                          className="btn btn-success"
                          style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          onClick={() => completeTask(task.id)}
                          title="Mark Complete"
                        >
                          Mark Complete
                        </button>

                        <button 
                          className="btn btn-amber"
                          style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          onClick={() => partialCompleteTask(task.id, 50)}
                          title="Almost Done"
                        >
                          Almost Done
                        </button>

                        <button 
                          className="btn btn-danger"
                          style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          onClick={() => missTask(task.id)}
                          title="Not Finished (Trigger ReRoute)"
                        >
                          Not Finished
                        </button>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: isCompleted ? '#34D399' : isMissed ? '#F87171' : '#FBBF24'
                      }}>
                        {isCompleted && '✓ Completed'}
                        {isMissed && 'Missed · Rerouted 🔄'}
                        {isPartial && 'Progress Saved ✓'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Academic World Progress & Pacing Check (Two-column layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Academic Status / Pacing Check (Part 7) */}
        <div className="arcade-hud-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '8px' }}>
            Academic Pacing Status
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
              {vibeStatus === "YOU'RE COOKING" && "🔥 You're cooking."}
              {vibeStatus === "GETTING THERE" && "👀 Getting there."}
              {vibeStatus === "SLIGHTLY COOKED" && "💀 Slightly cooked."}
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: '14px' }}>
            {vibeStatus === "YOU'RE COOKING" && "You're ahead of your plan this week. Keep building your streak!"}
            {vibeStatus === "GETTING THERE" && "Steady progress. Knock out today's move to unlock your next milestone."}
            {vibeStatus === "SLIGHTLY COOKED" && "Some deadlines are getting close. ReRoute is actively protecting your schedule."}
          </p>

          <div style={{
            padding: '10px 12px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--space-border)',
            fontSize: '0.8rem',
            color: 'var(--text-sub)',
            lineHeight: 1.4
          }}>
            💬 <strong>ReRoute Insight:</strong> {aiInsights?.studyInsight || "We moved your upcoming tasks because exams are approaching."}
          </div>
        </div>

        {/* Academic World Milestones / Subjects (GAMEY Library Style) */}
        <div className="arcade-hud-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '2px' }}>
                Course Library
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>
                Your Academic World
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.74rem' }}>
                {academicGlowUp}% Mastered
              </span>
              <button 
                className="btn btn-secondary"
                style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                onClick={() => setActiveTab('subjects')}
              >
                + Add Subject
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subjects.map(s => {
              const subTopics = topics.filter(t => t.subjectId === s.id);
              const avg = subTopics.length > 0 
                ? Math.round(subTopics.reduce((a, b) => a + b.progress, 0) / subTopics.length)
                : 0;

              return (
                <div 
                  key={s.id} 
                  onClick={() => setActiveTab('subjects')}
                  style={{ 
                    padding: '12px 14px', 
                    borderRadius: '8px', 
                    background: 'rgba(255, 255, 255, 0.02)', 
                    border: '1px solid var(--game-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'var(--game-border)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                      <span style={{ fontSize: '1.1rem' }}>{getSubjectWorldIcon(s.name)}</span>
                      <span>{s.name}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 500 }}>({subTopics.length} topics)</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: avg >= 75 ? 'var(--game-emerald)' : '#818CF8', fontWeight: 800 }}>
                      {avg}%
                    </span>
                  </div>
                  {/* Modern Gaming Mastery Bar */}
                  {renderHudMeter(avg, avg >= 75 ? 'green' : 'cyan', 8)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
