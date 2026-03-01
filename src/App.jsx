import React from 'react';
import Layout from './components/Layout';
import MetricCards from './components/MetricCards';
import AnalyticsCard from './components/AnalyticsCard';
import ReminderCard from './components/ReminderCard';
import ProjectList from './components/ProjectList';
import TeamCard from './components/TeamCard';
import ProgressCard from './components/ProgressCard';
import TimerCard from './components/TimerCard';

function App() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default App;
