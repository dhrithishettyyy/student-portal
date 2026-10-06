import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { StudyPlanView } from './components/StudyPlanView';
import { NextBestTaskView } from './components/NextBestTaskView';
import { FocusMode } from './components/FocusMode';
import { ReRouteAuditView } from './components/ReRouteAuditView';
import { SubjectsView } from './components/SubjectsView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { DemoWalkthroughBar } from './components/DemoWalkthroughBar';
import { ToastNotification } from './components/ToastNotification';
import { AuthModal } from './components/AuthModal';
import { RerouteModal } from './components/RerouteModal';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeFocusTask, 
    setActiveFocusTask,
    loadDemoScenario,
    isRerouteModalOpen,
    setIsRerouteModalOpen,
    latestRerouteLog
  } = useApp();

  const [isLandingMode, setIsLandingMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // If viewing the Landing Page
  if (isLandingMode) {
    return (
      <>
        <LandingPage 
          onGetStarted={() => setIsLandingMode(false)}
          onSignIn={() => {
            setIsLandingMode(false);
            setIsAuthOpen(true);
          }}
          onLaunchDemo={() => {
            loadDemoScenario();
            setIsLandingMode(false);
          }}
        />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Full-Height Left Sidebar (Matching GAMEY) */}
      <Sidebar />

      {/* Main Content Area with Top Navbar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

        <main className="app-main" style={{ padding: '28px 36px', flex: 1 }}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'study-plan' && <StudyPlanView />}
          {activeTab === 'next-task' && <NextBestTaskView />}
          {activeTab === 'focus-mode' && (
            <FocusMode 
              task={activeFocusTask} 
              onClose={() => {
                setActiveFocusTask(null);
                setActiveTab('dashboard');
              }} 
            />
          )}
          {activeTab === 'reroute-audit' && <ReRouteAuditView />}
          {activeTab === 'subjects' && <SubjectsView />}
          {activeTab === 'progress' && <AnalyticsView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Interactive Sticky Demo Bar for Judges */}
      <DemoWalkthroughBar />

      {/* Popups & Modals */}
      <ToastNotification />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <RerouteModal 
        isOpen={isRerouteModalOpen} 
        onClose={() => setIsRerouteModalOpen(false)}
        onViewPlan={() => setActiveTab('study-plan')}
        latestLog={latestRerouteLog}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
