import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardHome from './components/dashboard/DashboardHome';
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
      <DashboardHome />
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
        actions: <></>

      };
    } else if (path.includes('/dashboard/settings')) {
      return {
        title: 'Preferences',
        description: 'Configure layout, notifications, and AI experiences.',
        actions: <></>
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
