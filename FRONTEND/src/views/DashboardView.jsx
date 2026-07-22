import React from 'react';
import { useOS } from '../context/OSContext';
import {
  Mountain,
  Sparkles,
  Target,
  Brain,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Compass
} from 'lucide-react';
import './DashboardView.css';

export const DashboardView = () => {
  const {
    altitude,
    objectives,
    memories,
    journals,
    toggleSubtask,
    setActiveTab
  } = useOS();

  const percentSummit = Math.min(100, Math.round((altitude.currentMeters / altitude.maxMeters) * 100));
  const activeObjectives = objectives.filter((o) => o.stage !== 'summit');
  const completedObjectives = objectives.filter((o) => o.stage === 'summit');

  return (
    <div className="dashboard-container">
      {/* K2 Summit Hero Card */}
      <div className="summit-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge badge-cyan">
            <Mountain size={14} /> Basecamp Mountain Status
          </div>
          <h2 className="hero-title title-gradient">
            Climbing Towards: {altitude.peakGoal}
          </h2>
          <p className="hero-desc">
            You are currently at <strong>{altitude.currentMeters}m</strong> altitude ({percentSummit}% of the 8,611m summit). High discipline, focused execution, and unified context are your navigation tools.
          </p>

          <div className="hero-stats-row">
            <div className="stat-pill">
              <span className="stat-label">Season Target</span>
              <span className="stat-val">{altitude.seasonName}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Peak Elevation</span>
              <span className="stat-val">{altitude.maxMeters}m</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Summit Altitude</span>
              <span className="stat-val color-cyan">{altitude.currentMeters}m</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="altitude-meter-circle">
            <svg viewBox="0 0 100 100" className="circle-svg">
              <circle cx="50" cy="50" r="42" className="circle-bg" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="circle-fill"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * percentSummit) / 100
                }}
              />
            </svg>
            <div className="circle-text">
              <span className="circle-pct">{percentSummit}%</span>
              <span className="circle-lbl">Summit</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Daily Briefing Card */}
      <div className="briefing-card glass-panel">
        <div className="briefing-header">
          <Sparkles className="briefing-sparkle" size={18} />
          <h3>K2 Basecamp AI - Daily Briefing</h3>
          <span className="badge badge-violet">Live Context Sync</span>
        </div>
        <p className="briefing-body">
          Good afternoon! Based on your <strong>Memory Core ({memories.length} nodes)</strong> and active Objectives, your primary summit focus for today is <strong>"{activeObjectives[0]?.title || 'System Execution'}"</strong>. You have <strong>{journals.length} recent reflections</strong> logged in Neural Journal. Keep up the high cognitive momentum!
        </p>
      </div>

      {/* Quick Metrics Grid */}
      <div className="metrics-grid">
        <div
          className="metric-card glass-panel glass-panel-interactive"
          onClick={() => setActiveTab('objectives')}
        >
          <div className="metric-header">
            <Target size={20} className="metric-icon color-cyan" />
            <span className="badge badge-cyan">{activeObjectives.length} Active</span>
          </div>
          <div className="metric-val">{objectives.length}</div>
          <div className="metric-lbl">Total Objectives</div>
        </div>

        <div
          className="metric-card glass-panel glass-panel-interactive"
          onClick={() => setActiveTab('memory')}
        >
          <div className="metric-header">
            <Brain size={20} className="metric-icon color-violet" />
            <span className="badge badge-violet">{memories.length} Nodes</span>
          </div>
          <div className="metric-val">{memories.length}</div>
          <div className="metric-lbl">Memory Core Graph</div>
        </div>

        <div
          className="metric-card glass-panel glass-panel-interactive"
          onClick={() => setActiveTab('journal')}
        >
          <div className="metric-header">
            <BookOpen size={20} className="metric-icon color-gold" />
            <span className="badge badge-gold">Active Streak</span>
          </div>
          <div className="metric-val">{journals.length}</div>
          <div className="metric-lbl">Neural Journal Notes</div>
        </div>

        <div
          className="metric-card glass-panel glass-panel-interactive"
          onClick={() => setActiveTab('future')}
        >
          <div className="metric-header">
            <TrendingUp size={20} className="metric-icon color-emerald" />
            <span className="badge badge-emerald">4 Modules</span>
          </div>
          <div className="metric-val">100%</div>
          <div className="metric-lbl">System Operations</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Active Objectives */}
        <div className="dashboard-col glass-panel">
          <div className="col-header">
            <h3><Target size={16} /> Active Summit Priorities</h3>
            <button className="text-btn" onClick={() => setActiveTab('objectives')}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="objectives-list">
            {activeObjectives.slice(0, 3).map((obj) => (
              <div key={obj.id} className="obj-dash-card">
                <div className="obj-dash-top">
                  <span className={`badge ${obj.priority === 'Critical' ? 'badge-rose' : 'badge-cyan'}`}>
                    {obj.priority}
                  </span>
                  <span className="obj-due">
                    <Calendar size={12} /> {obj.dueDate}
                  </span>
                </div>
                <h4 className="obj-title">{obj.title}</h4>
                <div className="subtasks-dash">
                  {obj.subtasks.map((st) => (
                    <div
                      key={st.id}
                      className={`st-dash-item ${st.completed ? 'completed' : ''}`}
                      onClick={() => toggleSubtask(obj.id, st.id)}
                    >
                      <CheckCircle2 size={14} className="st-check" />
                      <span>{st.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Memory Context & Journal Preview */}
        <div className="dashboard-col glass-panel">
          <div className="col-header">
            <h3><Brain size={16} /> Memory Context Preview</h3>
            <button className="text-btn" onClick={() => setActiveTab('memory')}>
              Explore Graph <ArrowRight size={14} />
            </button>
          </div>

          <div className="memory-preview-list">
            {memories.slice(0, 3).map((mem) => (
              <div key={mem.id} className="mem-preview-card">
                <div className="mem-preview-top">
                  <span className="mem-topic">{mem.topic}</span>
                  <span className="badge badge-violet">{mem.category}</span>
                </div>
                <p className="mem-content">{mem.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
