import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import {
  Search,
  LayoutDashboard,
  Brain,
  BookOpen,
  Target,
  Sparkles,
  Layers,
  X,
  Volume2
} from 'lucide-react';
import './CommandPalette.css';

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    handleToggleSoundscape,
    objectives,
    memories
  } = useOS();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { label: 'Go to Mission Control Dashboard', tab: 'dashboard', icon: LayoutDashboard },
    { label: 'Explore Memory Core Context Graph', tab: 'memory', icon: Brain },
    { label: 'Open Neural Journal Editor', tab: 'journal', icon: BookOpen },
    { label: 'View Objectives Execution Kanban', tab: 'objectives', icon: Target },
    { label: 'Chat with K2 Basecamp AI Assistant', tab: 'ai', icon: Sparkles },
    { label: 'Check Future Systems Integrations', tab: 'future', icon: Layers },
    { label: 'Toggle Alpine Wind Focus Soundscape', action: handleToggleSoundscape, icon: Volume2 }
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    if (item.tab) {
      setActiveTab(item.tab);
    } else if (item.action) {
      item.action();
    }
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="cmd-overlay" onClick={() => setIsCommandPaletteOpen(false)}>
      <div className="cmd-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-input-wrapper">
          <Search size={18} className="cmd-search-icon" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="cmd-close-btn" onClick={() => setIsCommandPaletteOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="cmd-results">
          <div className="cmd-section-title">SUGGESTED ACTIONS</div>
          {filteredActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="cmd-item"
                onClick={() => handleSelect(item)}
              >
                <Icon size={16} className="cmd-item-icon" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="cmd-footer">
          <span>Use <strong>ESC</strong> to close</span>
          <span><strong>Ctrl + K</strong> to toggle</span>
        </div>
      </div>
    </div>
  );
};
