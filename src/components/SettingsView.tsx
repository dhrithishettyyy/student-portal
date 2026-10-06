import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEVELS } from '../services/gamification';
import { 
  Clock, Award, Bell, Volume2, RotateCcw, 
  CheckCircle2, Database, Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    updateUserHours, 
    userLevel, 
    loadDemoScenario, 
    resetAll 
  } = useApp();

  const [hours, setHours] = useState(user?.availableStudyHours || 3);

  // Notification & Sound Alert toggles (Task 1)
  const [audioChime, setAudioChime] = useState<boolean>(() => {
    const saved = localStorage.getItem('reroute_audio_chime');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [popupAlerts, setPopupAlerts] = useState<boolean>(() => {
    const saved = localStorage.getItem('reroute_popup_alerts');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleSaveHours = (newHours: number) => {
    setHours(newHours);
    updateUserHours(newHours);
  };

  const playBellChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // Dual harmonic sine bell chime (fundamental + overtone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5 bell
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1760, now); // A6 overtone

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn("Audio chime not supported or muted", e);
    }
  };

  const toggleAudioChime = () => {
    const nextVal = !audioChime;
    setAudioChime(nextVal);
    localStorage.setItem('reroute_audio_chime', JSON.stringify(nextVal));
    if (nextVal) {
      playBellChime();
    }
  };

  const togglePopupAlerts = () => {
    const nextVal = !popupAlerts;
    setPopupAlerts(nextVal);
    localStorage.setItem('reroute_popup_alerts', JSON.stringify(nextVal));
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px' }}>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge" style={{ 
            background: 'rgba(99, 102, 241, 0.15)', 
            color: '#A5B4FC', 
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontSize: '0.74rem'
          }}>
            USER PREFERENCES
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
            COMMAND CONFIGURATION
          </span>
        </div>
        <h1 style={{ fontSize: '2.1rem', color: '#FFFFFF', letterSpacing: '-0.02em', fontWeight: 800 }}>
          Settings & Profile
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>
          Configure daily study capacity, review progression ranks, customize sound alerts, and access demo data.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* 1. Daily Available Study Hours (slider) */}
        <section className="arcade-hud-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="hud-icon-box purple">
                <Clock size={18} color="#818CF8" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                  Daily Available Study Hours
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                  ReRoute strictly caps each day's study tasks to this duration. Overflows automatically balance into upcoming days.
                </p>
              </div>
            </div>

            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#818CF8' }}>
              {hours}h / DAY
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <input 
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={hours}
              onChange={(e) => handleSaveHours(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#6366F1', height: '6px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', minWidth: '70px', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>
              CAP: {hours * 60}m
            </span>
          </div>
        </section>

        {/* 2. Academic Weapon XP Progression (ranks list) */}
        <section className="arcade-hud-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="hud-icon-box orange">
                <Award size={18} color="#F59E0B" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                  Academic Weapon XP Progression
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                  Earn XP by cooking study blocks, sustaining streaks, and tackling urgent exam topics.
                </p>
              </div>
            </div>

            <div className="badge badge-xp" style={{ fontSize: '0.78rem', fontWeight: 800 }}>
              ⚡ CURRENT: {user?.xp || 640} XP
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {LEVELS.map((lvl) => {
              const isCurrent = userLevel.level === lvl.level;
              const isAchieved = (user?.xp || 0) >= lvl.minXp;

              return (
                <div 
                  key={lvl.level}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: isCurrent ? '1.5px solid var(--game-primary)' : '1px solid var(--game-border)',
                    background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isCurrent ? '0 0 16px rgba(99, 102, 241, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{lvl.badge}</span>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? '#A5B4FC' : '#FFFFFF' }}>
                        {lvl.title} {isCurrent && '◄ (ACTIVE RANK)'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>
                        {lvl.minXp} — {lvl.maxXp} XP REQUIRED
                      </div>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#C7D2FE', border: '1px solid rgba(99, 102, 241, 0.4)', fontSize: '0.72rem', fontWeight: 800 }}>
                      IN PROGRESS
                    </span>
                  ) : isAchieved ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: 'var(--game-emerald)', fontWeight: 700 }}>
                      <CheckCircle2 size={15} color="#10B981" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>
                      LOCKED
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. New Study Session Notification & Sound Alerts (Task 1 Replacement) */}
        <section className="arcade-hud-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="hud-icon-box green">
              <Bell size={18} color="#10B981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                Study Session Notification & Sound Alerts
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                Customize study timer feedback and system notification behaviors.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Toggle 1: Audio Chime on Timer End */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--game-border)',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={17} color={audioChime ? "var(--game-emerald)" : "var(--text-dim)"} />
                  <span style={{ fontWeight: 700, fontSize: '0.94rem', color: '#FFFFFF' }}>
                    Audio Chime on Timer End
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: '3px' }}>
                  Plays a soft bell sound when a study countdown block finishes.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                  onClick={playBellChime}
                  title="Test Chime Sound"
                >
                  Test Chime
                </button>

                {/* GAMEY Toggle Switch */}
                <button
                  type="button"
                  onClick={toggleAudioChime}
                  style={{
                    width: '48px',
                    height: '26px',
                    borderRadius: '13px',
                    background: audioChime ? 'var(--game-emerald)' : '#1E2438',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                    boxShadow: audioChime ? '0 0 14px rgba(16, 185, 129, 0.45)' : 'none',
                    padding: 0
                  }}
                  aria-label="Toggle Audio Chime on Timer End"
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: audioChime ? '25px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
                  }} />
                </button>
              </div>
            </div>

            {/* Toggle 2: Visual Popup Alerts */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--game-border)',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={17} color={popupAlerts ? "var(--game-primary)" : "var(--text-dim)"} />
                  <span style={{ fontWeight: 700, fontSize: '0.94rem', color: '#FFFFFF' }}>
                    Visual Popup Alerts
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: '3px' }}>
                  Shows browser or in-app snackbar notifications when a task transitions or gets rerouted.
                </p>
              </div>

              {/* GAMEY Toggle Switch */}
              <button
                type="button"
                onClick={togglePopupAlerts}
                style={{
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  background: popupAlerts ? 'var(--game-primary)' : '#1E2438',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s ease',
                  boxShadow: popupAlerts ? '0 0 14px rgba(99, 102, 241, 0.45)' : 'none',
                  padding: 0
                }}
                aria-label="Toggle Visual Popup Alerts"
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  position: 'absolute',
                  top: '3px',
                  left: popupAlerts ? '25px' : '3px',
                  transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
                }} />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Reset & Demo Controls (buttons) */}
        <section className="arcade-hud-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div className="hud-icon-box purple">
              <Database size={18} color="#8B5CF6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                Reset & Demo Controls
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                Restore initial hackathon demo scenario (DBMS 3d, Java 7d, AI 10d) or clear local storage.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={loadDemoScenario}>
              <RotateCcw size={14} />
              Reload Demo Scenario
            </button>
            <button className="btn btn-danger" onClick={resetAll}>
              Clear All Data & Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
