// Neural Journal App Component - K2.OS Reflection & Idea Capture

import { getJournals, saveJournals } from '../storage.js';
import { playSound } from '../soundManager.js';

export function renderNeuralJournal(container) {
  let journals = getJournals();
  let selectedId = journals.length > 0 ? journals[0].id : null;
  let filterTag = 'All';
  let searchQuery = '';

  function render() {
    const filteredJournals = journals.filter(j => {
      const matchesTag = filterTag === 'All' || j.tag === filterTag;
      const matchesSearch = searchQuery === '' || 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        j.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });

    const activeJournal = journals.find(j => j.id === selectedId) || { id: null, title: '', tag: 'Reflection', content: '', date: '' };

    container.innerHTML = `
      <div class="journal-app">
        <!-- Sidebar -->
        <div class="journal-sidebar">
          <div class="journal-sidebar-header">
            <input type="text" id="journal-search" class="form-input search-input" placeholder="Search entries..." value="${escapeHtml(searchQuery)}">
            <button class="btn btn-primary btn-sm" id="btn-journal-new" style="margin-top: 8px; width: 100%;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              New Reflection
            </button>
          </div>

          <div class="journal-filter-tags">
            <span class="j-tag-chip ${filterTag === 'All' ? 'active' : ''}" data-tag="All">All</span>
            <span class="j-tag-chip ${filterTag === 'Reflection' ? 'active' : ''}" data-tag="Reflection">Reflection</span>
            <span class="j-tag-chip ${filterTag === 'Planning' ? 'active' : ''}" data-tag="Planning">Planning</span>
            <span class="j-tag-chip ${filterTag === 'Idea' ? 'active' : ''}" data-tag="Idea">Idea</span>
            <span class="j-tag-chip ${filterTag === 'Goal' ? 'active' : ''}" data-tag="Goal">Goal</span>
          </div>

          <div class="journal-entry-list">
            ${filteredJournals.length === 0 ? '<p class="empty-state">No entries found.</p>' : ''}
            ${filteredJournals.map(j => `
              <div class="journal-item ${j.id === selectedId ? 'active' : ''}" data-id="${j.id}">
                <div class="ji-header">
                  <span class="ji-title">${escapeHtml(j.title || 'Untitled Entry')}</span>
                  <span class="badge badge-secondary">${escapeHtml(j.tag)}</span>
                </div>
                <div class="ji-snippet">${escapeHtml(j.content.substring(0, 70) || 'Empty entry...')}</div>
                <div class="ji-date">${escapeHtml(j.date)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Editor Area -->
        <div class="journal-editor">
          ${selectedId ? `
            <div class="editor-toolbar">
              <input type="text" id="editor-title" class="editor-title-input" placeholder="Title your reflection..." value="${escapeHtml(activeJournal.title)}">
              <div class="editor-actions">
                <select id="editor-tag" class="form-select">
                  <option value="Reflection" ${activeJournal.tag === 'Reflection' ? 'selected' : ''}>Reflection</option>
                  <option value="Planning" ${activeJournal.tag === 'Planning' ? 'selected' : ''}>Planning</option>
                  <option value="Idea" ${activeJournal.tag === 'Idea' ? 'selected' : ''}>Idea</option>
                  <option value="Goal" ${activeJournal.tag === 'Goal' ? 'selected' : ''}>Goal</option>
                </select>
                <button class="btn btn-secondary btn-sm" id="btn-journal-ai-insight">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  AI Synthesis
                </button>
                <button class="btn btn-primary btn-sm" id="btn-journal-save">Save</button>
                <button class="btn btn-danger-icon btn-sm" id="btn-journal-delete" title="Delete Entry">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>

            <div class="editor-meta-bar">
              <span>Last Saved: ${escapeHtml(activeJournal.date || 'Just now')}</span>
            </div>

            <textarea id="editor-content" class="editor-textarea" placeholder="Write your thoughts, ideas, reflections, and planning...">${escapeHtml(activeJournal.content)}</textarea>

            <div id="ai-insight-box" class="ai-insight-panel hidden">
              <div class="ai-insight-header">
                <strong>AI Synthesis & Insights</strong>
                <button class="btn-close-sm" id="btn-close-insight">&times;</button>
              </div>
              <div id="ai-insight-text" class="ai-insight-text">Analyzing reflection...</div>
            </div>
          ` : `
            <div class="journal-empty-view">
              <p>Select an entry from the sidebar or create a new reflection.</p>
              <button class="btn btn-primary" id="btn-empty-new">Create New Entry</button>
            </div>
          `}
        </div>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Search listener
    const searchInput = container.querySelector('#journal-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });
    }

    // Tag filter chips
    container.querySelectorAll('.j-tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        filterTag = chip.dataset.tag;
        render();
      });
    });

    // Select entry
    container.querySelectorAll('.journal-item').forEach(item => {
      item.addEventListener('click', () => {
        selectedId = item.dataset.id;
        playSound('click');
        render();
      });
    });

    // Create new
    const btnNew = container.querySelector('#btn-journal-new') || container.querySelector('#btn-empty-new');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        const newEntry = {
          id: 'j-' + Date.now(),
          title: 'New Neural Reflection',
          tag: 'Reflection',
          date: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          content: ''
        };
        journals.unshift(newEntry);
        selectedId = newEntry.id;
        saveJournals(journals);
        playSound('open');
        render();
      });
    }

    // Save entry
    const btnSave = container.querySelector('#btn-journal-save');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const titleVal = container.querySelector('#editor-title').value;
        const tagVal = container.querySelector('#editor-tag').value;
        const contentVal = container.querySelector('#editor-content').value;

        const idx = journals.findIndex(j => j.id === selectedId);
        if (idx !== -1) {
          journals[idx].title = titleVal || 'Untitled Entry';
          journals[idx].tag = tagVal;
          journals[idx].content = contentVal;
          journals[idx].date = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
          saveJournals(journals);
          playSound('save');
          render();
        }
      });
    }

    // Delete entry
    const btnDelete = container.querySelector('#btn-journal-delete');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        if (confirm('Delete this reflection entry?')) {
          journals = journals.filter(j => j.id !== selectedId);
          selectedId = journals.length > 0 ? journals[0].id : null;
          saveJournals(journals);
          playSound('trash');
          render();
        }
      });
    }

    // AI Insight synthesis
    const btnInsight = container.querySelector('#btn-journal-ai-insight');
    if (btnInsight) {
      btnInsight.addEventListener('click', () => {
        const contentVal = container.querySelector('#editor-content').value;
        const insightBox = container.querySelector('#ai-insight-box');
        const insightText = container.querySelector('#ai-insight-text');

        if (!contentVal.trim()) {
          alert('Please write something in your journal entry first to synthesize AI insights.');
          return;
        }

        insightBox.classList.remove('hidden');
        insightText.innerHTML = '⚡ <em>Processing neural reflection patterns...</em>';
        playSound('click');

        setTimeout(() => {
          insightText.innerHTML = `
            <strong>K2 AI Analysis:</strong><br>
            • <strong>Core Theme:</strong> Focus on disciplined execution and system architecture.<br>
            • <strong>Actionable takeaway:</strong> Align current pending tasks with your long-term goal of building K2.OS.<br>
            • <strong>Suggested next step:</strong> Schedule a 25-minute focus sprint on task implementation.
          `;
        }, 800);
      });
    }

    const btnCloseInsight = container.querySelector('#btn-close-insight');
    if (btnCloseInsight) {
      btnCloseInsight.addEventListener('click', () => {
        container.querySelector('#ai-insight-box')?.classList.add('hidden');
      });
    }
  }

  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
