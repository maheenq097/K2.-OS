// Memory Core App Component - K2.OS Context & Profile Memory Manager

import { getProfile, saveProfile, getInterests, saveInterests, getProjects, saveProjects } from '../storage.js';
import { playSound } from '../soundManager.js';

export function renderMemoryCore(container) {
  let profile = getProfile();
  let interests = getInterests();
  let projects = getProjects();
  let activeTab = 'profile'; // profile, interests, projects, preview

  function render() {
    container.innerHTML = `
      <div class="memory-core-app">
        <!-- Sidebar Navigation -->
        <div class="mc-sidebar">
          <div class="mc-sb-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
            <span>Memory Core</span>
          </div>

          <div class="mc-nav-list">
            <button class="mc-nav-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              User Profile
            </button>

            <button class="mc-nav-item ${activeTab === 'interests' ? 'active' : ''}" data-tab="interests">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Interests & Focus
            </button>

            <button class="mc-nav-item ${activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Key Projects
            </button>

            <button class="mc-nav-item ${activeTab === 'preview' ? 'active' : ''}" data-tab="preview">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              AI Context Injection
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="mc-content">
          ${activeTab === 'profile' ? `
            <div class="mc-section">
              <h2>User Profile & Ascent Vision</h2>
              <p>This information forms the core identity injected into K2.OS AI responses.</p>
              
              <div class="form-group" style="margin-top: 15px;">
                <label>User Name:</label>
                <input type="text" id="prof-name" class="form-input" value="${escapeHtml(profile.name)}">
              </div>

              <div class="form-group">
                <label>Role / Title:</label>
                <input type="text" id="prof-role" class="form-input" value="${escapeHtml(profile.role)}">
              </div>

              <div class="form-group">
                <label>Personal Motto:</label>
                <input type="text" id="prof-motto" class="form-input" value="${escapeHtml(profile.motto)}">
              </div>

              <div class="form-group">
                <label>Mountain Goal (Primary Target):</label>
                <input type="text" id="prof-goal" class="form-input" value="${escapeHtml(profile.mountainGoal)}">
              </div>

              <button class="btn btn-primary" id="btn-save-profile" style="margin-top: 10px;">Save Profile Context</button>
            </div>
          ` : activeTab === 'interests' ? `
            <div class="mc-section">
              <h2>Interests & Expertise Tags</h2>
              <p>Topics and domains K2.OS AI uses to frame insights and recommendation engines.</p>

              <div class="form-row" style="margin-top: 15px;">
                <input type="text" id="new-interest-input" class="form-input" placeholder="Add interest (e.g. Machine Learning, System Design)...">
                <button class="btn btn-primary" id="btn-add-interest">Add Tag</button>
              </div>

              <div class="tags-container" style="margin-top: 20px;">
                ${interests.map((tag, idx) => `
                  <span class="memory-chip-large">
                    ${escapeHtml(tag)}
                    <button class="btn-chip-remove" data-idx="${idx}">&times;</button>
                  </span>
                `).join('')}
              </div>
            </div>
          ` : activeTab === 'projects' ? `
            <div class="mc-section">
              <h2>Key Projects & Endeavors</h2>
              <p>Active responsibilities K2.OS prioritizes in Mission Control and AI Assistant.</p>

              <div class="add-project-card" style="margin-top: 15px;">
                <input type="text" id="new-proj-title" class="form-input" placeholder="Project Title..." style="margin-bottom: 8px;">
                <input type="text" id="new-proj-goal" class="form-input" placeholder="Project Goal & Description..." style="margin-bottom: 8px;">
                <select id="new-proj-status" class="form-select" style="margin-bottom: 8px;">
                  <option value="In Progress">In Progress</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
                <button class="btn btn-primary" id="btn-add-project">Add Project</button>
              </div>

              <div class="projects-list-grid" style="margin-top: 20px;">
                ${projects.map((p, idx) => `
                  <div class="project-card-item">
                    <div class="pci-header">
                      <strong>${escapeHtml(p.title)}</strong>
                      <span class="badge badge-secondary">${escapeHtml(p.status)}</span>
                    </div>
                    <p class="pci-goal">${escapeHtml(p.goal || 'No description.')}</p>
                    <button class="btn-danger-icon btn-sm btn-delete-project" data-idx="${idx}">Delete</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="mc-section">
              <h2>AI Context Injection Preview</h2>
              <p>Below is the exact structured prompt header inserted into AI interactions:</p>

              <pre class="code-preview-box"><code>SYSTEM MEMORY CORE CONTEXT:
---------------------------
User: ${escapeHtml(profile.name)}
Role: ${escapeHtml(profile.role)}
Motto: "${escapeHtml(profile.motto)}"
Mountain Goal: ${escapeHtml(profile.mountainGoal)}

Known Interests:
${interests.map(i => '  • ' + escapeHtml(i)).join('\n')}

Active Projects:
${projects.map(p => `  • ${escapeHtml(p.title)} [${escapeHtml(p.status)}]: ${escapeHtml(p.goal)}`).join('\n')}
---------------------------</code></pre>
            </div>
          `}
        </div>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Navigation items
    container.querySelectorAll('.mc-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        activeTab = item.dataset.tab;
        playSound('click');
        render();
      });
    });

    // Save profile
    const btnSaveProf = container.querySelector('#btn-save-profile');
    if (btnSaveProf) {
      btnSaveProf.addEventListener('click', () => {
        profile.name = container.querySelector('#prof-name').value;
        profile.role = container.querySelector('#prof-role').value;
        profile.motto = container.querySelector('#prof-motto').value;
        profile.mountainGoal = container.querySelector('#prof-goal').value;
        saveProfile(profile);
        playSound('save');
        alert('User profile context saved to Memory Core!');
        render();
      });
    }

    // Add interest tag
    const btnAddInterest = container.querySelector('#btn-add-interest');
    if (btnAddInterest) {
      btnAddInterest.addEventListener('click', () => {
        const input = container.querySelector('#new-interest-input');
        const val = input.value.trim();
        if (val) {
          interests.push(val);
          saveInterests(interests);
          playSound('open');
          render();
        }
      });
    }

    // Remove interest tag
    container.querySelectorAll('.btn-chip-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        interests.splice(idx, 1);
        saveInterests(interests);
        playSound('trash');
        render();
      });
    });

    // Add project
    const btnAddProj = container.querySelector('#btn-add-project');
    if (btnAddProj) {
      btnAddProj.addEventListener('click', () => {
        const title = container.querySelector('#new-proj-title').value.trim();
        const goal = container.querySelector('#new-proj-goal').value.trim();
        const status = container.querySelector('#new-proj-status').value;

        if (title) {
          projects.push({
            id: 'proj-' + Date.now(),
            title: title,
            goal: goal,
            status: status
          });
          saveProjects(projects);
          playSound('open');
          render();
        }
      });
    }

    // Delete project
    container.querySelectorAll('.btn-delete-project').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        projects.splice(idx, 1);
        saveProjects(projects);
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
