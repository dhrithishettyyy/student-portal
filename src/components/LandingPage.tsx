import React from 'react';
import { ArrowRight, Zap, CheckCircle2, XCircle, Calendar, Clock } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onSignIn, 
  onLaunchDemo 
}) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 48px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 23, 0.95)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5" cy="6" r="2.5" />
              <circle cx="19" cy="18" r="2.5" />
              <path d="M5 8.5v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-1" />
              <polyline points="15 11 19 7 23 11" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              ReRoute
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onSignIn}>
            Sign In
          </button>
          <button className="btn btn-primary" onClick={onGetStarted}>
            Get Started →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: '56px 24px', maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#93C5FD',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <span>Adaptive Study Planning & Progress Tracker</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.2vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '18px',
            color: '#FFFFFF'
          }}>
            Missed a task?<br />
            <span style={{ color: '#60A5FA' }}>
              We rebuild the plan.
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '620px',
            margin: '0 auto 32px'
          }}>
            An adaptive study planner that continuously adjusts your schedule according to your actual progress, deadlines, and available study hours.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-hero"
              style={{ padding: '14px 30px' }}
              onClick={onGetStarted}
            >
              Get Started →
            </button>

            <button 
              className="btn btn-secondary"
              style={{ padding: '14px 26px', border: '1px solid rgba(59, 130, 246, 0.4)' }}
              onClick={onLaunchDemo}
            >
              <Zap size={16} color="#FBBF24" />
              Launch Live Demo
            </button>
          </div>
        </div>

        {/* Visual: Original Plan → Missed Task → ReRoute → Updated Plan (Section 2 Requirement) */}
        <section 
          className="surface-card-hero"
          style={{
            padding: '32px 28px',
            marginBottom: '48px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              How ReRoute Automatically Adapts
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Normal planners fail when you fall behind. ReRoute shifts workloads and protects your deadlines.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px'
          }}>
            {/* Step 1: Original Plan */}
            <div className="surface-card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 700, marginBottom: '8px' }}>
                1. Original Plan
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ padding: '5px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px' }}>DBMS (90 min)</div>
                <div style={{ padding: '5px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px' }}>Java (60 min)</div>
                <div style={{ padding: '5px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px' }}>AI (30 min)</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#60A5FA', fontWeight: 600 }}>
                Total: 3.0 Hours
              </div>
            </div>

            {/* Step 2: Missed Task */}
            <div className="surface-card" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#F87171', fontWeight: 700, marginBottom: '8px' }}>
                2. Missed Task
              </div>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ padding: '5px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', borderRadius: '4px' }}>DBMS: Completed</div>
                <div style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', borderRadius: '4px' }}>Java: Missed 💀</div>
                <div style={{ padding: '5px 8px', background: 'rgba(245, 158, 11, 0.1)', color: '#FDE68A', borderRadius: '4px' }}>AI: Partial</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#F87171', fontWeight: 600 }}>
                Student fell behind
              </div>
            </div>

            {/* Step 3: ReRoute Analysis */}
            <div className="surface-card" style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#93C5FD', fontWeight: 700, marginBottom: '8px' }}>
                3. ReRoute Engine 🔄
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                <div>• DBMS workload retired</div>
                <div>• Java priority elevated (+25%)</div>
                <div>• AI remaining work split</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#93C5FD', fontWeight: 600 }}>
                Analyzing new priorities
              </div>
            </div>

            {/* Step 4: Updated Plan */}
            <div className="surface-card" style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#34D399', fontWeight: 700, marginBottom: '8px' }}>
                4. Rebuilt Plan
              </div>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', borderRadius: '4px' }}>Java (Tomorrow #1)</div>
                <div style={{ padding: '5px 8px', background: 'rgba(245, 158, 11, 0.1)', color: '#FDE68A', borderRadius: '4px' }}>AI Part 2 (Scheduled)</div>
                <div style={{ padding: '5px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#6EE7B7', borderRadius: '4px' }}>Zero Daily Overload</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#34D399', fontWeight: 600 }}>
                Comeback plan ready 🚀
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Value Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="surface-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '8px' }}>Explainable Priority</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Tasks are prioritized mathematically by exam urgency, syllabus progress gap, and workload, not random sorting.
            </p>
          </div>

          <div className="surface-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '8px' }}>Single-Task Focus</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Eliminate choice paralysis. ReRoute highlights your single "Today's Move" with a clean countdown timer.
            </p>
          </div>

          <div className="surface-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '8px' }}>Pacing Vibe Check</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Realistic progress evaluation that keeps you motivated. Know whether you're genuinely cooking or slightly cooked.
            </p>
          </div>
        </div>
      </main>

      <footer style={{
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        ReRoute 🔄 — Built for students who want to study smarter, not stress harder.
      </footer>
    </div>
  );
};
