
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { StudyMate } from './views/StudyMate';
import { SocialLab } from './views/SocialLab';
import { GrowthGarden } from './views/GrowthGarden';
import { MentalRescue } from './views/MentalRescue';
import { ExplorationQuest } from './views/ExplorationQuest';
import { AppView, UserStats, Task } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [showRescue, setShowRescue] = useState(false);
  
  // Global State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    currentXp: 0,
    nextLevelXp: 100,
    streak: 3,
    totalTasks: 12,
    outdoorLevel: 1 // Starting outdoor exploration level
  });

  const addXp = (amount: number) => {
    setStats(prev => {
      let newXp = prev.currentXp + amount;
      let newLevel = prev.level;
      let nextXp = prev.nextLevelXp;

      if (newXp >= nextXp) {
        newLevel += 1;
        newXp = newXp - nextXp;
        nextXp = Math.floor(nextXp * 1.2); // Increase difficulty
        // Could trigger level up modal here
      }

      return {
        ...prev,
        currentXp: newXp,
        level: newLevel,
        nextLevelXp: nextXp,
        totalTasks: prev.totalTasks + (amount > 0 ? 1 : 0)
      };
    });
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard tasks={tasks} setTasks={setTasks} addXp={addXp} triggerRescue={() => setShowRescue(true)} />;
      case AppView.STUDY:
        return <StudyMate addXp={addXp} />;
      case AppView.SOCIAL:
        return <SocialLab addXp={addXp} />;
      case AppView.QUEST:
        return <ExplorationQuest level={stats.outdoorLevel} addXp={addXp} />;
      case AppView.GROWTH:
        return <GrowthGarden stats={stats} />;
      default:
        return <Dashboard tasks={tasks} setTasks={setTasks} addXp={addXp} triggerRescue={() => setShowRescue(true)} />;
    }
  };

  return (
    <>
      <Layout 
        currentView={currentView} 
        onChangeView={setCurrentView}
        triggerRescue={() => setShowRescue(true)}
      >
        {renderView()}
      </Layout>
      
      <MentalRescue 
        isOpen={showRescue} 
        onClose={() => setShowRescue(false)} 
      />
    </>
  );
}

export default App;
