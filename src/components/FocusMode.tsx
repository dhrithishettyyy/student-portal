import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StudyTask } from '../types';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, X, 
  CheckCircle2, Clock, ArrowRight 
} from 'lucide-react';
import { playBellChime } from '../services/soundEffects';

interface FocusModeProps {
  task: StudyTask | null;
  onClose: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ task, onClose }) => {
  const { 
    tasks, 
    nextBestTask, 
    completeTask, 
    missTask, 
    partialCompleteTask,
    setIsRerouteModalOpen,
    showToast
  } = useApp();

  const activeTask = task || nextBestTask || tasks[0];

  const initialSeconds = (activeTask?.plannedDuration || 45) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [partialPercentage, setPartialPercentage] = useState(50);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (activeTask) {
      setSecondsLeft(activeTask.plannedDuration * 60);
      setIsRunning(false);
    }
  }, [activeTask?.id]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Task 1: Play soft bell chime if audioChime is enabled (defaults to true)
            const chimeSetting = localStorage.getItem('reroute_audio_chime');
            if (chimeSetting !== 'false') {
              playBellChime();
            }
            // Task 1: Trigger visual popup alert if popupAlerts is enabled
            showToast(
              "🔔 Study Session Completed!",
              `Great grind! Your study block for "${activeTask.topicName}" has ended. Record your outcome!`,
              'success'
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, activeTask?.topicName]);

  // Audio tone simulation
  useEffect(() => {
    if (soundEnabled && isRunning) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        gain.gain.setValueAtTime(0.012, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        oscRef.current = osc;
      } catch (e) {}
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    }

    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (e) {}
      }
    };
  }, [soundEnabled, isRunning]);

  if (!activeTask) {
    return (
      <div className="surface-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3>No task selected</h3>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={onClose}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = activeTask.plannedDuration * 60;
  const progressPercent = Math.min(100, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100));

  const handleOutcome = (outcome: 'Completed' | 'Partially Completed' | 'Missed') => {
    if (outcome === 'Completed') {
      completeTask(activeTask.id);
      onClose();
    } else if (outcome === 'Missed') {
      missTask(activeTask.id);
      onClose();
    } else {
      partialCompleteTask(activeTask.id, partialPercentage);
      setShowPartialModal(false);
      onClose();
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge" style={{ 
            background: 'rgba(99, 102, 241, 0.18)', 
            color: '#A5B4FC', 
            border: '1px solid rgba(99, 102, 241, 0.35)', 
            fontSize: '0.76rem', 
            fontWeight: 800 
          }}>
            ⚡ FOCUS MODE
          </span>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-sub)' }}>
            Distraction-Free Deep Study Block
          </span>
        </div>

        <button 
          className="btn btn-ghost" 
          style={{ padding: '6px', borderRadius: '50%' }}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Focus Card */}
      <div 
        className="hud-hero-card"
        style={{
          padding: '48px 36px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Subject & Topic */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            letterSpacing: '0.06em', 
            color: '#818CF8', 
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            {activeTask.subjectName}
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginBottom: '8px' }}>
            {activeTask.topicName}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>
            Planned: <strong style={{ color: '#FFFFFF' }}>{activeTask.plannedDuration} minutes</strong> · Difficulty: {activeTask.difficulty}
          </p>
        </div>

        {/* Big Clean Gaming Timer */}
        <div style={{
          fontSize: 'clamp(4.2rem, 14vw, 6.8rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          textShadow: '0 0 35px rgba(99, 102, 241, 0.4)',
          margin: '20px 0',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          {timeFormatted}
        </div>

        {/* Video Game Progress Bar (Focus Meter) */}
        <div style={{ maxWidth: '420px', margin: '0 auto 36px' }}>
          <div className="hud-meter-frame" style={{ marginBottom: '8px' }}>
            <div className="hud-meter-track" style={{ height: '12px' }}>
              <div 
                className="hud-mana-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-sub)' }}>
            <span>ELAPSED: {Math.round((totalSeconds - secondsLeft) / 60)}M</span>
            <span style={{ color: '#818CF8', fontWeight: 700 }}>{progressPercent}% COMPLETE</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '44px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setSecondsLeft(prev => Math.max(60, prev - 300))}
            title="-5 minutes"
          >
            -5m
          </button>

          <button 
            className={isRunning ? "btn btn-amber" : "btn btn-hero"}
            style={{ padding: '12px 32px', fontSize: '1.05rem' }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause size={18} />
                Pause
              </>
            ) : (
              <>
                <Play size={18} fill="#FFFFFF" />
                {secondsLeft === initialSeconds ? 'Start Timer' : 'Resume'}
              </>
            )}
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(initialSeconds);
            }}
            title="Reset timer"
          >
            <RotateCcw size={16} />
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => setSecondsLeft(prev => prev + 300)}
            title="+5 minutes"
          >
            +5m
          </button>

          <button 
            className="btn btn-ghost"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute Alpha Wave Audio" : "Play Alpha Wave Audio"}
            style={{ color: soundEnabled ? '#34D399' : 'var(--text-muted)' }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        {/* Human Outcome Buttons (Section 3 Requirement) */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '28px'
        }}>
          <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '6px' }}>
            Done studying? Record your result:
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            ReRoute will immediately recalculate your upcoming schedule if needed.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {/* Mark Complete */}
            <button
              onClick={() => handleOutcome('Completed')}
              className="btn btn-success"
              style={{ padding: '12px 20px', fontSize: '0.92rem' }}
            >
              <CheckCircle2 size={16} />
              Mark Complete
            </button>

            {/* Almost Done */}
            <button
              onClick={() => setShowPartialModal(true)}
              className="btn btn-amber"
              style={{ padding: '12px 20px', fontSize: '0.92rem' }}
            >
              Almost Done
            </button>

            {/* Not Finished (Part 9 Requirement) */}
            <button
              onClick={() => handleOutcome('Missed')}
              className="btn btn-danger"
              style={{ padding: '12px 20px', fontSize: '0.92rem' }}
            >
              Not Finished
            </button>
          </div>
        </div>
      </div>

      {/* Almost Done / Partial completion modal (Part 8 Requirement) */}
      {showPartialModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 14, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 80,
          padding: '20px'
        }}>
          <div className="surface-card" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '6px' }}>
              Almost there! How much did you finish?
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Nice work. Your progress will be saved and your task will be updated.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Progress achieved:</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FBBF24' }}>{partialPercentage}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="90" 
                step="10"
                value={partialPercentage}
                onChange={(e) => setPartialPercentage(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setShowPartialModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => handleOutcome('Partially Completed')}
              >
                Save Progress & Update →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
