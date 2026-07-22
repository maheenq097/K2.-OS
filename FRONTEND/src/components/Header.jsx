import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import {
  Search,
  Command,
  Clock,
  Plus,
  Sparkles,
  LayoutDashboard,
  Brain,
  BookOpen,
  Target,
  Layers
} from 'lucide-react';
import './Header.css';

export const Header = () => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    setIsCommandPaletteOpen,
    addObjective,
    addMemory,
    setActiveTab
  } = useOS();

  const [currentTime, setCurrentTime] = useState('');
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Mission Control', subtitle: 'Basecamp Dashboard & Summit Metrics', icon: LayoutDashboard };
      case 'memory':
        return { title: 'Memory Core', subtitle: 'Persistent Personal Context Graph', icon: Brain };
      case 'journal':
        return { title: 'Neural Journal', subtitle: 'AI-Assisted Reflections & Idea Synthesis', icon: BookOpen };
      case 'objectives':
        return { title: 'Objectives Engine', subtitle: 'Mountain Altitude Kanban & Execution', icon: Target };
      case 'ai':
        return { title: 'K2 Basecamp AI', subtitle: 'Integrated Intelligent Assistant', icon: Sparkles };
      case 'future':
        return { title: 'Future Systems Hub', subtitle: 'LMS, Calendar & Automation Integrations', icon: Layers };
      default:
        return { title: 'K2.OS', subtitle: 'Personal Operating System', icon: LayoutDashboard };
    }
  };

  const { title, subtitle, icon: HeaderIcon } = getTabTitle();

  const handleQuickAddObjective = () => {
    const title = prompt("Enter new Objective title:");
    if (title) {
      addObjective({ title, category: "Projects", priority: "High" });
      setActiveTab('objectives');
    }
    setShowQuickMenu(false);
  };

  const handleQuickAddMemory = () => {
    const topic = prompt("Enter Memory Topic:");
    const content = prompt("Enter Context / Detail:");
    if (topic && content) {
      addMemory({ topic, content, category: "Interests" });
      setActiveTab('memory');
    }
    setShowQuickMenu(false);
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="title-icon-wrapper">
          <HeaderIcon size={20} className="header-icon" />
        </div>
        <div className="header-titles">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search objectives, memories, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="cmd-palette-btn"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command size={14} />
          <span className="cmd-text">Ctrl K</span>
        </button>

        {/* Live Clock */}
        <div className="header-clock">
          <Clock size={14} className="clock-icon" />
          <span>{currentTime}</span>
        </div>

        {/* Quick Action Button */}
        <div className="quick-action-wrapper">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="btn-primary quick-action-btn"
          >
            <Plus size={16} />
            <span>Action</span>
          </button>

          {showQuickMenu && (
            <div className="quick-menu-dropdown glass-panel">
              <button onClick={handleQuickAddObjective}>
                <Target size={14} /> Add Objective
              </button>
              <button onClick={handleQuickAddMemory}>
                <Brain size={14} /> Store Memory
              </button>
              <button onClick={() => { setActiveTab('journal'); setShowQuickMenu(false); }}>
                <BookOpen size={14} /> Write Journal
              </button>
              <button onClick={() => { setActiveTab('ai'); setShowQuickMenu(false); }}>
                <Sparkles size={14} /> Query Basecamp AI
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
