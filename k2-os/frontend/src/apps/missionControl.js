// Mission Control App Component - K2.OS Dashboard

import { getProfile, getTasks, getJournals, getInterests, getProjects } from '../storage.js';
import { playSound } from '../soundManager.js';

export function renderMissionControl(container, openAppCallback) {
  const profile = getProfile();
  const tasks = getTasks();
  const journals = getJournals();
  const interests = getInterests();
  const projects = getProjects();

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const recentJournals = journals.slice(0, 3);

  container.innerHTML = `
    <div class="mission-control">
      <!-- Welcome Header -->
      <div class="mc-hero-banner">
        <div class="mc-hero-content">
          <div class="mc-badge">K2.OS VERSION 1.0 &bull; BUILT FOR THE ASCENT</div>
          <h1 class="mc-title">Welcome back, ${escapeHtml(profile.name)}</h1>
          <p class="mc-subtitle">"${escapeHtml(profile.motto)}" &mdash; Mountain Goal: <strong>${escapeHtml(profile.mountainGoal)}</strong></p>
        </div>
        <div class="mc-hero-actions">
          <button class="btn btn-primary" id="btn-mc-new-journal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            New Journal
          </button>
          <button class="btn btn-secondary" id="btn-mc-open-ai">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Ask AI Assistant
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="mc-stats-grid">
        <div class="stat-card">
          <div class="stat-icon icon-purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${pendingTasks.length}</span>
            <span class="stat-label">Pending Objectives</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${journals.length}</span>
            <span class="stat-label">Neural Reflections</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${completedTasks.length}</span>
            <span class="stat-label">Goals Accomplished</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${projects.length}</span>
            <span class="stat-label">Active Projects</span>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Columns -->
      <div class="mc-grid-two-col">
        <!-- Left Column: Pending Tasks & Current Priorities -->
        <div class="mc-panel">
          <div class="mc-panel-header">
            <h3>Current Priorities & Objectives</h3>
            <button class="btn-text" id="btn-mc-all-tasks">View All Objectives &rarr;</button>
          </div>
          <div class="mc-task-list">
            ${pendingTasks.length === 0 ? '<p class="empty-state">No pending objectives! You are on top of the summit.</p>' : ''}
            ${pendingTasks.map(task => `
              <div class="mc-task-item">
                <div class="mc-task-left">
                  <span class="priority-dot priority-${task.priority.toLowerCase()}"></span>
                  <div class="mc-task-details">
                    <span class="mc-task-title">${escapeHtml(task.title)}</span>
                    <span class="mc-task-meta">${escapeHtml(task.category)} &bull; Due ${escapeHtml(task.dueDate || 'Soon')}</span>
                  </div>
                </div>
                <span class="badge badge-${task.priority === 'High' ? 'danger' : 'secondary'}">${escapeHtml(task.priority)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right Column: Recent Neural Journal & Memory Context -->
        <div class="mc-panel">
          <div class="mc-panel-header">
            <h3>Recent Neural Journal Entries</h3>
            <button class="btn-text" id="btn-mc-all-journals">Open Neural Journal &rarr;</button>
          </div>
          <div class="mc-journal-list">
            ${recentJournals.length === 0 ? '<p class="empty-state">No reflections saved yet.</p>' : ''}
            ${recentJournals.map(j => `
              <div class="mc-journal-card">
                <div class="mc-j-top">
                  <span class="badge badge-primary">${escapeHtml(j.tag)}</span>
                  <span class="mc-j-date">${escapeHtml(j.date)}</span>
                </div>
                <h4 class="mc-j-title">${escapeHtml(j.title)}</h4>
                <p class="mc-j-snippet">${escapeHtml(j.content.substring(0, 120))}...</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Row: Memory Core Quick Context -->
      <div class="mc-panel mc-memory-summary">
        <div class="mc-panel-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px; color: var(--accent);"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
            Memory Core & User Context
          </h3>
          <button class="btn-text" id="btn-mc-manage-memory">Manage Memory Core &rarr;</button>
        </div>
        <div class="memory-tags-cloud">
          <div class="memory-tag-group">
            <strong>Interests:</strong>
            ${interests.map(i => `<span class="memory-chip">${escapeHtml(i)}</span>`).join('')}
          </div>
          <div class="memory-tag-group" style="margin-top: 10px;">
            <strong>Key Projects:</strong>
            ${projects.map(p => `<span class="memory-chip chip-project">${escapeHtml(p.title)} (${escapeHtml(p.status)})</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('btn-mc-new-journal')?.addEventListener('click', () => {
    playSound('click');
    openAppCallback('neuralJournal');
  });

  document.getElementById('btn-mc-open-ai')?.addEventListener('click', () => {
    playSound('click');
    openAppCallback('aiAssistant');
  });

  document.getElementById('btn-mc-all-tasks')?.addEventListener('click', () => {
    playSound('click');
    openAppCallback('objectives');
  });

  document.getElementById('btn-mc-all-journals')?.addEventListener('click', () => {
    playSound('click');
    openAppCallback('neuralJournal');
  });

  document.getElementById('btn-mc-manage-memory')?.addEventListener('click', () => {
    playSound('click');
    openAppCallback('memoryCore');
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
