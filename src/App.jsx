import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MetricCards from './components/dashboard/MetricCards';
import AnalyticsCard from './components/dashboard/AnalyticsCard';
import ReminderCard from './components/dashboard/ReminderCard';
import ProjectList from './components/dashboard/ProjectList';
import TeamCard from './components/dashboard/TeamCard';
import ProgressCard from './components/dashboard/ProgressCard';
import TimerCard from './components/dashboard/TimerCard';
import TaskBuilder from './components/tasks/TaskBuilder';
import EmailDocumentSummarizer from './components/summarizer/EmailDocumentSummarizer';
import SettingsPage from './components/settings/SettingsPage';

import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AuthRoute from './components/auth/AuthRoute';

import { SettingsProvider } from './context/SettingsContext';

function DashboardContent() {
  const [activeView, setActiveView] = useState('tasks');
  const [focusMode, setFocusMode] = useState(false);

  const getLayoutProps = () => {
    switch (activeView) {
      case 'tasks':
        return {
          title: 'Tasks',
          description: 'Create, manage, and execute your tasks.',
          actions: <></>
        };
      case 'summarizer':
        return {
          title: 'Email & Document Summarizer',
          description: 'Convert long emails and documents into clear summaries, tasks, and deadlines.',
          actions: (
            <>
              <button className="px-5 py-2.5 rounded-[var(--radius-btn)] border border-[var(--color-brand-start)] text-[var(--color-brand-start)] font-medium text-[14px] hover:bg-[var(--color-success-bg)] transition-colors">
                Paste Email
              </button>
              <button className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-medium text-[14px] flex items-center gap-2 hover:bg-[var(--color-brand-mid)] transition-colors shadow-sm">
                Upload Document
              </button>
            </>
          )
        };
      case 'settings':
        return {
          title: 'Preferences',
          description: 'Configure layout, notifications, and AI experiences.',
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Plan, prioritize, and accomplish your tasks with ease.',
        };
    }
  };

  const layoutProps = getLayoutProps();

  return (
    <Layout
      title={layoutProps.title}
      description={layoutProps.description}
      actions={layoutProps.actions}
      activeView={activeView}
      onViewChange={setActiveView}
      focusMode={focusMode}
      setFocusMode={setFocusMode}
    >
      {activeView === 'tasks' ? (
        <TaskBuilder />
      ) : activeView === 'summarizer' ? (
        <EmailDocumentSummarizer />
      ) : activeView === 'settings' ? (
        <SettingsPage />
      ) : (
        <div className={`transition-all duration-300 ${focusMode ? 'opacity-30 pointer-events-none' : ''}`}>
          <MetricCards />

          {/* 12-Column Grid Layout for Main Content */}
          <div className="grid grid-cols-12 gap-6 h-auto">

            {/* Left Column (8 cols on lg) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

              {/* Top Row of Main Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                <AnalyticsCard />
                <ReminderCard />
              </div>

              {/* Bottom Row of Main Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                <TeamCard />
                <ProgressCard />
              </div>

            </div>

            {/* Right Column (4 cols on lg) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="h-[400px]">
                <ProjectList />
              </div>
              <div className="h-[200px]">
                <TimerCard />
              </div>
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
}

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <DashboardContent />
              </AuthRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
