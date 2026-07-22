import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import {
  Layers,
  GraduationCap,
  Calendar,
  BookOpen,
  Workflow,
  CheckCircle2,
  RefreshCw,
  Zap,
  Radio,
  Lock
} from 'lucide-react';
import './FutureView.css';

export const FutureView = () => {
  const { futureSystems, toggleSystemConnection } = useOS();
  const [syncingId, setSyncingId] = useState(null);

  const getIcon = (name) => {
    switch (name) {
      case 'GraduationCap': return GraduationCap;
      case 'Calendar': return Calendar;
      case 'BookOpen': return BookOpen;
      default: return Workflow;
    }
  };

  const handleTestSync = (sysId) => {
    setSyncingId(sysId);
    setTimeout(() => {
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="future-container">
      {/* Hero Banner */}
      <div className="future-hero glass-panel">
        <div className="hero-left">
          <div className="hero-icon-box">
            <Layers size={24} className="color-cyan" />
          </div>
          <div>
            <h3>Future Systems Hub</h3>
            <p>Modular extension architecture connecting K2.OS to external tools, LMS platforms, and automation webhooks.</p>
          </div>
        </div>

        <div className="hero-status">
          <Radio size={16} className="color-emerald pulse-animation" />
          <span>Integration Engine Online</span>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="systems-grid">
        {futureSystems.map((sys) => {
          const Icon = getIcon(sys.icon);
          const isSyncing = syncingId === sys.id;

          return (
            <div key={sys.id} className="system-card glass-panel">
              <div className="sys-card-header">
                <div className="sys-icon-wrapper">
                  <Icon size={20} className="color-cyan" />
                </div>
                <div className="sys-status-badge">
                  <span className={`badge ${sys.connected ? 'badge-emerald' : 'badge-gold'}`}>
                    {sys.connected ? 'Active' : sys.status}
                  </span>
                </div>
              </div>

              <h4 className="sys-title">{sys.name}</h4>
              <p className="sys-desc">{sys.description}</p>

              <div className="sys-card-footer">
                <button
                  className={`connect-toggle-btn ${sys.connected ? 'connected' : ''}`}
                  onClick={() => toggleSystemConnection(sys.id)}
                >
                  <CheckCircle2 size={14} />
                  <span>{sys.connected ? 'Connected' : 'Enable System'}</span>
                </button>

                <button
                  className="test-sync-btn"
                  onClick={() => handleTestSync(sys.id)}
                  disabled={isSyncing}
                >
                  <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
                  <span>{isSyncing ? 'Syncing...' : 'Test Sync'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Roadmap Preview */}
      <div className="roadmap-panel glass-panel">
        <h3><Zap size={18} className="color-gold" /> Ecosystem Roadmap</h3>
        <div className="roadmap-grid">
          <div className="rm-item">
            <Lock size={14} className="color-violet" />
            <div>
              <strong>Notion & Obsidian Importer</strong>
              <p>Direct import of existing second brain markdown files.</p>
            </div>
          </div>
          <div className="rm-item">
            <Lock size={14} className="color-violet" />
            <div>
              <strong>Biometric Focus Telemetry</strong>
              <p>Heart rate & focus level synchronization during deep work sessions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
