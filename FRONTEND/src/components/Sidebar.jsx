import React from 'react';
import { useOS } from '../context/OSContext';
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  Target,
  Sparkles,
  Layers,
  Mountain,
  Volume2,
  VolumeX,
  Compass,
  UserCheck
} from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
  const { activeTab, setActiveTab, altitude, isAudioPlaying, handleToggleSoundscape } = useOS();

  const navItems = [
    { id: 'dashboard', label: 'Mission Control', icon: LayoutDashboard, badge: 'Main' },
    { id: 'memory', label: 'Memory Core', icon: Brain, badge: 'Graph' },
    { id: 'journal', label: 'Neural Journal', icon: BookOpen, badge: 'AI' },
    { id: 'objectives', label: 'Objectives', icon: Target, badge: 'Kanban' },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, badge: 'Live' },
    { id: 'future', label: 'Future Systems', icon: Layers, badge: 'Hub' }
  ];

  const percentSummit = Math.round((altitude.currentMeters / altitude.maxMeters) * 100);

  return (
    <aside className="sidebar-container glass-panel">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Mountain className="brand-icon" />
        </div>
        <div className="brand-text">
          <h2>K2.OS <span className="os-tag">v2.6</span></h2>
          <p>Personal Command Center</p>
        </div>
      </div>

      {/* Altitude Progress Card */}
      <div className="altitude-card">
        <div className="altitude-header">
          <span className="alt-title">
            <Compass className="alt-icon" /> Summit Altitude
          </span>
          <span className="alt-meters">{altitude.currentMeters}m</span>
        </div>

        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentSummit}%` }}
          ></div>
        </div>

        <div className="altitude-footer">
          <span>Basecamp (0m)</span>
          <span className="summit-target">K2 Peak (8,611m)</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">NAVIGATION</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-btn ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${isActive ? 'active-badge' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Soundscape & User Footer */}
      <div className="sidebar-footer">
        <button
          onClick={handleToggleSoundscape}
          className={`soundscape-btn ${isAudioPlaying ? 'playing' : ''}`}
          title="Toggle Alpine Wind Focus Soundscape"
        >
          {isAudioPlaying ? <Volume2 className="pulse-icon" /> : <VolumeX />}
          <span>{isAudioPlaying ? 'Alpine Breeze ON' : 'Focus Soundscape'}</span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            <UserCheck size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">Climber Command</span>
            <span className="user-status">● Basecamp Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
