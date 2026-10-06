import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Difficulty, Subject, Topic } from '../types';
import { 
  BookOpen, Plus, Trash2, Edit3, Calendar, Clock, 
  CheckCircle2, Sparkles, X, AlertCircle
} from 'lucide-react';
import { getDaysRemaining } from '../services/priorityEngine';
import { getDateOffsetStr } from '../services/rerouteEngine';

export const SubjectsView: React.FC = () => {
  const { 
    subjects, 
    topics, 
    addSubject, 
    deleteSubject, 
    addTopic, 
    updateTopic, 
    deleteTopic 
  } = useApp();

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Form states for subject
  const [subjectName, setSubjectName] = useState('');
  const [subjectColor, setSubjectColor] = useState('#6366F1');

  // Form states for topic
  const [topicName, setTopicName] = useState('');
  const [topicSubjectId, setTopicSubjectId] = useState(subjects[0]?.id || '');
  const [topicDifficulty, setTopicDifficulty] = useState<Difficulty>('Medium');
  const [topicProgress, setTopicProgress] = useState(30);
  const [topicEstimatedMinutes, setTopicEstimatedMinutes] = useState(90);
  const [topicExamDate, setTopicExamDate] = useState(getDateOffsetStr(5));
  const [topicNotes, setTopicNotes] = useState('');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    addSubject({
      name: subjectName,
      color: subjectColor,
      examDate: getDateOffsetStr(7)
    });
    setSubjectName('');
    setShowAddSubjectModal(false);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim() || !topicSubjectId) return;
    addTopic({
      subjectId: topicSubjectId,
      name: topicName,
      difficulty: topicDifficulty,
      progress: topicProgress,
      estimatedMinutes: topicEstimatedMinutes,
      examDate: topicExamDate,
      notes: topicNotes,
    });
    setTopicName('');
    setShowAddTopicModal(false);
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <div>
          <span className="badge badge-vibe" style={{ marginBottom: '6px' }}>📚 Academic Curriculum</span>
          <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF' }}>
            Subjects & Topic Mastery
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Manage courses, topics, difficulty ratings, and upcoming exam deadlines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAddSubjectModal(true)}
          >
            <Plus size={16} />
            Add Subject
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setTopicSubjectId(subjects[0]?.id || '');
              setShowAddTopicModal(true);
            }}
          >
            <Plus size={16} />
            Add Topic
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {subjects.map(subject => {
          const subjectTopics = topics.filter(t => t.subjectId === subject.id);
          const avgProgress = subjectTopics.length > 0
            ? Math.round(subjectTopics.reduce((s, t) => s + t.progress, 0) / subjectTopics.length)
            : 0;

          return (
            <div key={subject.id} className="glass-panel" style={{ padding: '24px' }}>
              {/* Subject Title Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    backgroundColor: subject.color || '#6366F1'
                  }} />
                  <h2 style={{ fontSize: '1.35rem', color: '#FFFFFF' }}>
                    {subject.name}
                  </h2>
                  <span className="badge badge-vibe" style={{ fontSize: '0.74rem' }}>
                    {subjectTopics.length} topics
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Course Mastery:</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#34D399' }}>{avgProgress}%</span>
                  </div>

                  <button 
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    onClick={() => {
                      setTopicSubjectId(subject.id);
                      setShowAddTopicModal(true);
                    }}
                  >
                    <Plus size={13} />
                    Add Topic
                  </button>

                  <button 
                    className="btn btn-danger"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    onClick={() => deleteSubject(subject.id)}
                    title="Delete Subject"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Video Game HUD Subject Mastery Bar */}
              <div style={{ marginBottom: '20px' }}>
                <div className="hud-meter-frame">
                  <div className="hud-meter-track" style={{ height: '11px' }}>
                    <div 
                      className={avgProgress >= 75 ? "hud-hp-bar" : "hud-mana-bar"}
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics Table/List */}
              {subjectTopics.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  No topics added to this subject yet. Click "+ Add Topic" above.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {subjectTopics.map(topic => {
                    const daysLeft = getDaysRemaining(topic.examDate);

                    return (
                      <div 
                        key={topic.id}
                        className="glass-panel"
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className={`badge ${
                              topic.difficulty === 'Hard' ? 'badge-high' :
                              topic.difficulty === 'Medium' ? 'badge-medium' : 'badge-low'
                            }`}>
                              {topic.difficulty}
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.75rem', color: daysLeft <= 3 ? '#F87171' : 'var(--text-dim)', fontWeight: 600 }}>
                                {daysLeft <= 0 ? 'Exam Today' : `Exam in ${daysLeft}d`}
                              </span>
                              <button 
                                onClick={() => deleteTopic(topic.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '2px' }}
                                title="Delete Topic"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '6px' }}>
                            {topic.name}
                          </h4>

                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {topic.notes || `${topic.estimatedMinutes} minutes total workload`}
                          </p>
                        </div>

                        {/* Interactive Progress Slider */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                            <span style={{ color: 'var(--text-dim)' }}>Progress</span>
                            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{topic.progress}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={topic.progress}
                            onChange={(e) => updateTopic({ ...topic, progress: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: subject.color || '#6366F1', cursor: 'pointer' }}
                          />
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

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '20px'
        }}>
          <div className="glass-panel-elevated" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Add New Subject</h3>
              <button onClick={() => setShowAddSubjectModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Subject Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Distributed Systems"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF', fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Badge Color
                </label>
                <input 
                  type="color"
                  value={subjectColor}
                  onChange={(e) => setSubjectColor(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddSubjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '20px'
        }}>
          <div className="glass-panel-elevated" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Add New Topic</h3>
              <button onClick={() => setShowAddTopicModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Subject
                </label>
                <select 
                  value={topicSubjectId}
                  onChange={(e) => setTopicSubjectId(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    background: '#161D31', border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF', fontSize: '0.9rem'
                  }}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Topic Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Concurrency Control"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF', fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Difficulty
                  </label>
                  <select 
                    value={topicDifficulty}
                    onChange={(e) => setTopicDifficulty(e.target.value as Difficulty)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px',
                      background: '#161D31', border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF', fontSize: '0.9rem'
                    }}
                  >
                    <option value="Easy">🟢 Easy</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Hard">🔴 Hard</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Exam Date
                  </label>
                  <input 
                    type="date"
                    value={topicExamDate}
                    onChange={(e) => setTopicExamDate(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px',
                      background: '#161D31', border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF', fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Initial Progress: {topicProgress}%
                </label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={topicProgress}
                  onChange={(e) => setTopicProgress(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#6366F1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddTopicModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Add & Auto-Schedule 🔄
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
