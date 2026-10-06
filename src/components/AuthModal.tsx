import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User as UserIcon, Lock, Mail, Zap, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, logout, loadDemoScenario } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const displayName = isRegister ? (name || 'Student') : (email.split('@')[0]);
    login(displayName, email);
    onClose();
  };

  const handleDemoLogin = () => {
    loadDemoScenario();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 65, padding: '20px'
    }}>
      <div className="glass-panel-elevated" style={{ maxWidth: '440px', width: '100%', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '4px' }}>
              {user ? 'Your Profile' : isRegister ? 'Student Registration' : 'Student Sign In'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user ? 'Manage your active study session' : 'Persistent session powered by Firebase'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {user ? (
          <div>
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              marginBottom: '20px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <UserIcon size={20} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Sign Out
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
                Continue Studying
              </button>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
              {isRegister && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF', fontSize: '0.9rem'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Student Email
                </label>
                <input 
                  type="email" 
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF', fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF', fontSize: '0.9rem'
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                {isRegister ? 'Create Account & Start' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                style={{ background: 'none', border: 'none', color: '#818CF8', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isRegister ? 'Already registered? Sign In' : 'New student? Create an account'}
              </button>
            </div>

            {/* Quick Demo Login Option for Judges */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <button 
                className="btn btn-secondary"
                style={{ width: '100%', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#FBBF24' }}
                onClick={handleDemoLogin}
              >
                <Zap size={15} color="#FBBF24" />
                Instant Demo Student Sign-In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
