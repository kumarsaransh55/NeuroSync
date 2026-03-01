import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import MetricCards from './components/dashboard/MetricCards';
import AnalyticsCard from './components/dashboard/AnalyticsCard';
import ReminderCard from './components/dashboard/ReminderCard';
import ProjectList from './components/dashboard/ProjectList';
import TeamCard from './components/dashboard/TeamCard';
import ProgressCard from './components/dashboard/ProgressCard';
import TimerCard from './components/dashboard/TimerCard';
import TaskBuilder from './components/tasks/TaskBuilder';

function App() {
  const [activeView, setActiveView] = useState('tasks');

  return (
    <Layout
      title={activeView === 'tasks' ? 'Tasks' : 'Dashboard'}
      description={activeView === 'tasks' ? 'Create, manage, and execute your tasks.' : 'Plan, prioritize, and accomplish your tasks with ease.'}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {activeView === 'tasks' ? (
        <TaskBuilder />
      ) : (
        <>
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
        </>
      )}
    </Layout>
  );
}

export default App;
