// Objectives App Component - K2.OS Task & Goal Management

import { getTasks, saveTasks } from '../storage.js';
import { playSound } from '../soundManager.js';

export function renderObjectives(container) {
  let tasks = getTasks();
  let currentTab = 'Pending'; // Pending, Completed, All
  let priorityFilter = 'All';

  function render() {
    const filteredTasks = tasks.filter(t => {
      const matchesStatus = currentTab === 'All' || t.status === currentTab;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });

    const pendingCount = tasks.filter(t => t.status === 'Pending').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;

    container.innerHTML = `
      <div class="objectives-app">
        <!-- Top Toolbar -->
        <div class="obj-header">
          <div class="obj-header-left">
            <h2>K2 Objectives & Ascent Goals</h2>
            <p>Focused on execution rather than endless planning.</p>
          </div>
          <button class="btn btn-primary" id="btn-add-task-modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Add Objective
          </button>
        </div>

        <!-- Filter Controls Bar -->
        <div class="obj-controls-bar">
          <div class="obj-tabs">
            <button class="tab-btn ${currentTab === 'Pending' ? 'active' : ''}" data-tab="Pending">
              Pending (${pendingCount})
            </button>
            <button class="tab-btn ${currentTab === 'Completed' ? 'active' : ''}" data-tab="Completed">
              Completed (${completedCount})
            </button>
            <button class="tab-btn ${currentTab === 'All' ? 'active' : ''}" data-tab="All">
              All Tasks (${tasks.length})
            </button>
          </div>

          <div class="obj-priority-filter">
            <label>Priority:</label>
            <select id="select-priority-filter" class="form-select">
              <option value="All" ${priorityFilter === 'All' ? 'selected' : ''}>All Priorities</option>
              <option value="High" ${priorityFilter === 'High' ? 'selected' : ''}>High Priority</option>
              <option value="Medium" ${priorityFilter === 'Medium' ? 'selected' : ''}>Medium Priority</option>
              <option value="Low" ${priorityFilter === 'Low' ? 'selected' : ''}>Low Priority</option>
            </select>
          </div>
        </div>

        <!-- Add Task Form Panel -->
        <div id="add-task-panel" class="add-task-card hidden">
          <h3>Create New Objective</h3>
          <div class="form-row">
            <input type="text" id="new-task-title" class="form-input" placeholder="Objective title..." style="flex: 2;">
            <select id="new-task-priority" class="form-select">
              <option value="High">High Priority</option>
              <option value="Medium" selected>Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <select id="new-task-category" class="form-select">
              <option value="Project">Project</option>
              <option value="Personal">Personal</option>
              <option value="Learning">Learning</option>
            </select>
            <input type="date" id="new-task-date" class="form-input">
            <button class="btn btn-primary" id="btn-save-new-task">Save Objective</button>
            <button class="btn btn-secondary" id="btn-cancel-new-task">Cancel</button>
          </div>
        </div>

        <!-- Task List Table -->
        <div class="obj-list-container">
          ${filteredTasks.length === 0 ? `
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p>No objectives match your filter.</p>
            </div>
          ` : `
            <div class="obj-task-table">
              ${filteredTasks.map(t => `
                <div class="obj-row ${t.status === 'Completed' ? 'is-completed' : ''}">
                  <label class="custom-checkbox">
                    <input type="checkbox" class="task-checkbox" data-id="${t.id}" ${t.status === 'Completed' ? 'checked' : ''}>
                    <span class="checkmark"></span>
                  </label>

                  <div class="obj-row-body">
                    <span class="obj-row-title">${escapeHtml(t.title)}</span>
                    <span class="obj-row-meta">
                      <span class="badge badge-secondary">${escapeHtml(t.category || 'General')}</span>
                      ${t.dueDate ? `&bull; Due ${escapeHtml(t.dueDate)}` : ''}
                    </span>
                  </div>

                  <div class="obj-row-priority">
                    <span class="badge badge-${t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'secondary'}">
                      ${escapeHtml(t.priority)}
                    </span>
                  </div>

                  <div class="obj-row-actions">
                    <button class="btn-danger-icon btn-sm btn-delete-task" data-id="${t.id}" title="Delete Task">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Tab buttons
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        playSound('click');
        render();
      });
    });

    // Priority filter select
    const selectPriority = container.querySelector('#select-priority-filter');
    if (selectPriority) {
      selectPriority.addEventListener('change', (e) => {
        priorityFilter = e.target.value;
        render();
      });
    }

    // Toggle Add Task Form
    const btnAddModal = container.querySelector('#btn-add-task-modal');
    const addTaskPanel = container.querySelector('#add-task-panel');
    const btnCancelNew = container.querySelector('#btn-cancel-new-task');

    if (btnAddModal && addTaskPanel) {
      btnAddModal.addEventListener('click', () => {
        addTaskPanel.classList.toggle('hidden');
        playSound('click');
      });
    }

    if (btnCancelNew && addTaskPanel) {
      btnCancelNew.addEventListener('click', () => {
        addTaskPanel.classList.add('hidden');
      });
    }

    // Save New Task
    const btnSaveNew = container.querySelector('#btn-save-new-task');
    if (btnSaveNew) {
      btnSaveNew.addEventListener('click', () => {
        const title = container.querySelector('#new-task-title').value;
        const priority = container.querySelector('#new-task-priority').value;
        const category = container.querySelector('#new-task-category').value;
        const dueDate = container.querySelector('#new-task-date').value;

        if (!title.trim()) {
          alert('Please enter an objective title.');
          return;
        }

        const newTask = {
          id: 'task-' + Date.now(),
          title: title.trim(),
          priority: priority,
          category: category,
          status: 'Pending',
          dueDate: dueDate || new Date().toISOString().split('T')[0]
        };

        tasks.unshift(newTask);
        saveTasks(tasks);
        playSound('open');
        render();
      });
    }

    // Checkbox completion toggle
    container.querySelectorAll('.task-checkbox').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.dataset.id;
        const t = tasks.find(item => item.id === id);
        if (t) {
          t.status = chk.checked ? 'Completed' : 'Pending';
          saveTasks(tasks);
          if (chk.checked) playSound('complete');
          else playSound('click');
          render();
        }
      });
    });

    // Delete task
    container.querySelectorAll('.btn-delete-task').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(tasks);
        playSound('trash');
        render();
      });
    });
  }

  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
