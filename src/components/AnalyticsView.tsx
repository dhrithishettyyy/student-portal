import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Award } from 'lucide-react';
import { getDateOffsetStr, formatDatePretty } from '../services/rerouteEngine';

export const AnalyticsView: React.FC = () => {
  const { subjects, topics, tasks, user, academicGlowUp } = useApp();

  // 1. Subject Progress Data
  const subjectProgressData = subjects.map(s => {
    const sTopics = topics.filter(t => t.subjectId === s.id);
    const avgProgress = sTopics.length > 0 
      ? Math.round(sTopics.reduce((a, b) => a + b.progress, 0) / sTopics.length)
      : 0;
    return {
      name: s.name,
      mastery: avgProgress,
      topicsCount: sTopics.length
    };
  });

  // 2. Weekly Study Hours (Planned vs Actual)
  const weeklyHoursData = [0, 1, 2, 3, 4, 5, 6].map(offset => {
    const dStr = getDateOffsetStr(offset);
    const dayTasks = tasks.filter(t => t.date === dStr);
    const plannedMins = dayTasks.reduce((sum, t) => sum + t.plannedDuration, 0);
    const actualMins = dayTasks.reduce((sum, t) => sum + (t.actualDuration || (t.status === 'Completed' ? t.plannedDuration : 0)), 0);

    return {
      day: formatDatePretty(dStr),
      planned: Math.round((plannedMins / 60) * 10) / 10,
      actual: Math.round((actualMins / 60) * 10) / 10
    };
  });

  // 3. Task Status Distribution
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const partialCount = tasks.filter(t => t.status === 'Partially Completed').length;
  const missedCount = tasks.filter(t => t.status === 'Missed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;

  const taskStatusData = [
    { name: 'Completed ✅', value: completedCount, color: '#10B981' },
    { name: 'Partially Cooked 🍳', value: partialCount, color: '#F59E0B' },
    { name: 'Missed 💀', value: missedCount, color: '#EF4444' },
    { name: 'Pending', value: pendingCount, color: '#6366F1' },
  ].filter(d => d.value > 0);

  // 4. Overall Workload Remaining vs Completed
  const totalPlannedMinutes = tasks.reduce((sum, t) => sum + t.plannedDuration, 0);
  const completedMinutes = tasks.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.actualDuration || t.plannedDuration), 0);
  const remainingMinutes = Math.max(0, totalPlannedMinutes - completedMinutes);

  const overallWorkloadData = [
    { name: 'Completed Workload', value: Math.round(completedMinutes / 60 * 10) / 10, color: '#10B981' },
    { name: 'Remaining Workload', value: Math.round(remainingMinutes / 60 * 10) / 10, color: '#818CF8' }
  ];

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-vibe">📊 Deep Metrics</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-Time Productivity Analytics
          </span>
        </div>
        <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF' }}>
          Progress Analytics & Trends
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Detailed visibility into syllabus completion, weekly planned vs actual study time, and task outcomes.
        </p>
      </div>

      {/* Top 4 KPI metric chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Academic Glow-Up</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>{academicGlowUp}%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Across {topics.length} total topics</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Completed Hours</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#67E8F9' }}>
            {(completedMinutes / 60).toFixed(1)} hrs
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Productive study time logged</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total XP Earned</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24' }}>{user?.xp || 0} XP</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Level: {user?.xp ? 'Locked In' : 'Beginner'}</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ReRoute Adjustments</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C084FC' }}>
            {user?.rerouteCountThisWeek || 2}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Adaptive schedule rescues</div>
        </div>
      </div>

      {/* Grid of 4 Recharts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* Chart 1: Subject Progress */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>
            Course Mastery Comparison (%)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Compare preparation level across subjects to target weak spots
          </p>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={12} unit="%" />
                <Tooltip 
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF' }}
                />
                <Bar dataKey="mastery" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Study Hours (Planned vs Actual) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>
            Weekly Study Hours (Planned vs Actual)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Monitors adherence to your {user?.availableStudyHours || 3}h daily study budget
          </p>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyHoursData}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} unit="h" />
                <Tooltip 
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF' }}
                />
                <Area type="monotone" dataKey="planned" stroke="#818CF8" fill="rgba(99, 102, 241, 0.2)" />
                <Area type="monotone" dataKey="actual" stroke="#10B981" fill="rgba(16, 185, 129, 0.25)" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Task Status Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>
            Task Outcomes Distribution
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Proportion of Cooked, Partial, Missed, and Pending sessions
          </p>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Overall Workload Done vs Remaining */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>
            Total Workload Hours (Done vs Left)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Track overall hours required to complete upcoming exams
          </p>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallWorkloadData} layout="vertical">
                <XAxis type="number" stroke="#64748B" unit="h" />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={130} />
                <Tooltip 
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF' }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[0, 6, 6, 0]}>
                  {overallWorkloadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
