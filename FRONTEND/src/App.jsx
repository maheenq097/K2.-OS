import React from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { DashboardView } from './views/DashboardView';
import { MemoryView } from './views/MemoryView';
import { JournalView } from './views/JournalView';
import { ObjectivesView } from './views/ObjectivesView';
import { AIView } from './views/AIView';
import { FutureView } from './views/FutureView';
import './styles/theme.css';

const MainLayout = () => {
  const { activeTab } = useOS();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'memory':
        return <MemoryView />;
      case 'journal':
        return <JournalView />;
      case 'objectives':
        return <ObjectivesView />;
      case 'ai':
        return <AIView />;
      case 'future':
        return <FutureView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="view-content">
          {renderActiveView()}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
};

export function App() {
  return (
    <OSProvider>
      <MainLayout />
    </OSProvider>
  );
}

export default App;
