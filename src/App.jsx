import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
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
import { FocusProvider, useFocus } from './context/FocusContext';
import { TasksProvider } from './context/TasksContext';

function DashboardOverview() {
  const { focusMode } = useOutletContext() || { focusMode: false };
  return (
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
  );
}

function DashboardLayout() {
  const { focusMode, setFocusMode } = useFocus();
  const location = useLocation();
  const path = location.pathname;

  const getLayoutProps = () => {
    if (path.includes('/dashboard/tasks')) {
      return {
        title: 'Tasks',
        description: 'Create, manage, and execute your tasks.',
        actions: <></>
      };
    } else if (path.includes('/dashboard/summarizer')) {
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
    } else if (path.includes('/dashboard/settings')) {
      return {
        title: 'Preferences',
        description: 'Configure layout, notifications, and AI experiences.',
      };
    } else {
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
      focusMode={focusMode}
      setFocusMode={setFocusMode}
    >
      <Outlet context={{ focusMode }} />
    </Layout>
  );
}

function App() {
  return (
    <SettingsProvider>
      <FocusProvider>
      <TasksProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <DashboardLayout />
              </AuthRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="tasks" element={<TaskBuilder />} />
            <Route path="summarizer" element={<EmailDocumentSummarizer />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard/tasks" replace />} />
        </Routes>
      </BrowserRouter>
      </TasksProvider>
      </FocusProvider>
    </SettingsProvider>
  );
}

export default App;
