import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  Mountain,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Flame,
  Award
} from 'lucide-react';
import './ObjectivesView.css';

export const ObjectivesView = () => {
  const {
    objectives,
    addObjective,
    toggleSubtask,
    updateObjectiveStage,
    deleteObjective
  } = useOS();

  const [showAddModal, setShowAddModal] = useState(false);

  // New Objective Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Projects');
  const [priority, setPriority] = useState('High');
  const [dueDate, setDueDate] = useState('2026-07-30');
  const [subtasksInput, setSubtasksInput] = useState('');

  const stages = [
    { id: 'basecamp', label: 'Basecamp (0m)', alt: 'Planning & Prep', color: 'badge-cyan' },
    { id: 'ascent', label: 'Ascent (2,000m)', alt: 'Active Execution', color: 'badge-violet' },
    { id: 'ridge', label: 'Ridge (5,000m)', alt: 'Critical Testing', color: 'badge-gold' },
    { id: 'summit', label: 'Summit Peak (8,611m)', alt: 'Goal Achieved', color: 'badge-emerald' }
  ];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const subtasks = subtasksInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: `st-${Date.now()}-${idx}`, text, completed: false }));

    addObjective({
      title,
      category,
      priority,
      dueDate,
      subtasks: subtasks.length ? subtasks : [{ id: `st-${Date.now()}`, text: 'Execute main task', completed: false }]
    });

    setTitle('');
    setSubtasksInput('');
    setShowAddModal(false);
  };

  return (
    <div className="objectives-container">
      {/* Header Controls */}
      <div className="obj-header-row glass-panel">
        <div className="obj-title-group">
          <h3><Target size={20} className="color-cyan" /> Mountain Altitude Execution Kanban</h3>
          <p>Execution engine focused on moving tasks up the mountain stages to the 8,611m Summit Peak.</p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> New Objective
        </button>
      </div>

      {/* Kanban Stages Grid */}
      <div className="kanban-grid">
        {stages.map((stage) => {
          const stageObjs = objectives.filter((o) => o.stage === stage.id);
          return (
            <div key={stage.id} className="kanban-col glass-panel">
              <div className="kanban-col-header">
                <div className="col-title-badge">
                  <span className={`badge ${stage.color}`}>{stage.label}</span>
                  <span className="col-count">{stageObjs.length}</span>
                </div>
                <span className="col-alt-desc">{stage.alt}</span>
              </div>

              <div className="kanban-cards-list">
                {stageObjs.map((obj) => (
                  <div key={obj.id} className="kanban-card glass-panel">
                    <div className="card-top-row">
                      <span className={`badge ${obj.priority === 'Critical' ? 'badge-rose' : 'badge-cyan'}`}>
                        {obj.priority}
                      </span>
                      <button
                        className="delete-obj-btn"
                        onClick={() => deleteObjective(obj.id)}
                        title="Delete objective"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 className="card-title">{obj.title}</h4>

                    <div className="card-subtasks">
                      {obj.subtasks.map((st) => (
                        <div
                          key={st.id}
                          className={`subtask-row ${st.completed ? 'completed' : ''}`}
                          onClick={() => toggleSubtask(obj.id, st.id)}
                        >
                          <CheckCircle2 size={14} className="st-icon" />
                          <span>{st.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="card-footer">
                      <span className="card-due"><Calendar size={12} /> {obj.dueDate}</span>
                      <div className="stage-actions">
                        {stage.id !== 'basecamp' && (
                          <button
                            className="stage-move-btn"
                            title="Move back a stage"
                            onClick={() => {
                              const prevIdx = stages.findIndex(s => s.id === stage.id) - 1;
                              if (prevIdx >= 0) updateObjectiveStage(obj.id, stages[prevIdx].id);
                            }}
                          >
                            <ChevronLeft size={14} />
                          </button>
                        )}

                        {stage.id !== 'summit' && (
                          <button
                            className="stage-move-btn next"
                            title="Advance to next stage"
                            onClick={() => {
                              const nextIdx = stages.findIndex(s => s.id === stage.id) + 1;
                              if (nextIdx < stages.length) updateObjectiveStage(obj.id, stages[nextIdx].id);
                            }}
                          >
                            <span>Ascend</span>
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {stageObjs.length === 0 && (
                  <div className="empty-kanban-slot">
                    <span>No objectives at this altitude</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Objective Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Target size={18} className="color-cyan" /> Launch New Summit Objective</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label>Objective Title</label>
                <input
                  type="text"
                  placeholder="e.g. Finish Distributed Systems OEL"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-two">
                <div className="form-group flex-1">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Projects">Projects</option>
                    <option value="Academics">Academics</option>
                    <option value="Growth">Growth</option>
                    <option value="Future Systems">Future Systems</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Priority Level</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Target Target Deadline</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Subtask Action Items (one per line)</label>
                <textarea
                  rows="4"
                  placeholder="Draft system model&#10;Implement benchmark code&#10;Submit final report"
                  value={subtasksInput}
                  onChange={(e) => setSubtasksInput(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Launch Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
