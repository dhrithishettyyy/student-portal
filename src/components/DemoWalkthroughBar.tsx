import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw, Zap } from 'lucide-react';

export const DemoWalkthroughBar: React.FC = () => {
  const { demoStepState, executeDemoStep, loadDemoScenario, tasks, setIsRerouteModalOpen } = useApp();

  const dbmsDone = tasks.find(t => t.subjectName === 'DBMS')?.status === 'Completed';
  const javaMissed = tasks.find(t => t.subjectName === 'Java')?.status === 'Missed';
  const aiPartial = tasks.find(t => t.subjectName === 'AI')?.status === 'Partially Completed';

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(18, 22, 36, 0.96)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.2)',
        maxWidth: '92vw',
        overflowX: 'auto',
        borderRadius: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px', borderRight: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <Zap size={14} color="#FBBF24" />
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
          JUDGE DEMO:
        </span>
      </div>

      {/* Step 1 */}
      <button
        onClick={() => executeDemoStep(1)}
        className="btn"
        style={{
          fontSize: '0.76rem',
          padding: '6px 10px',
          background: dbmsDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          color: dbmsDone ? '#34D399' : '#FFFFFF',
          border: dbmsDone ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        {dbmsDone ? <CheckCircle2 size={12} color="#34D399" /> : '1.'} Finish DBMS
      </button>

      {/* Step 2 */}
      <button
        onClick={() => {
          executeDemoStep(2);
        }}
        className="btn"
        style={{
          fontSize: '0.76rem',
          padding: '6px 10px',
          background: javaMissed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          color: javaMissed ? '#F87171' : '#FFFFFF',
          border: javaMissed ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        {javaMissed ? <XCircle size={12} color="#F87171" /> : '2.'} Miss Java 💀
      </button>

      {/* Step 3 */}
      <button
        onClick={() => {
          executeDemoStep(3);
        }}
        className="btn"
        style={{
          fontSize: '0.76rem',
          padding: '6px 10px',
          background: aiPartial ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          color: aiPartial ? '#FBBF24' : '#FFFFFF',
          border: aiPartial ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        {aiPartial ? <Clock size={12} color="#FBBF24" /> : '3.'} Partial AI
      </button>

      {/* Step 4: Open Reroute Modal */}
      <button
        onClick={() => setIsRerouteModalOpen(true)}
        className="btn btn-primary"
        style={{
          fontSize: '0.76rem',
          padding: '6px 12px',
          flexShrink: 0
        }}
      >
        View ReRoute 🔄
      </button>

      {/* Reset */}
      <button
        onClick={loadDemoScenario}
        className="btn btn-ghost"
        style={{
          fontSize: '0.74rem',
          padding: '6px 8px',
          flexShrink: 0
        }}
        title="Reset demo scenario to initial 3-hour distribution"
      >
        <RotateCcw size={12} />
      </button>
    </div>
  );
};
