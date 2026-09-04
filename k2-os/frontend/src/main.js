// K2.OS Main Bootstrapper & Window Manager Engine

import { getSettings, saveSettings, getTasks, getJournals, getProfile } from './storage.js';
import { playSound } from './soundManager.js';

import { renderMissionControl } from './apps/missionControl.js';
import { renderNeuralJournal } from './apps/neuralJournal.js';
import { renderObjectives } from './apps/objectives.js';
import { renderAiAssistant } from './apps/aiAssistant.js';
import { renderMemoryCore } from './apps/memoryCore.js';
import { renderSystemSettings } from './apps/systemSettings.js';

// Registered OS Applications
const APPS = {
  missionControl: {
    id: 'missionControl',
    title: 'Mission Control',
    iconClass: 'icon-bg-mc',
    defaultWidth: 920,
    defaultHeight: 640,
    render: (c, openApp) => renderMissionControl(c, openApp)
  },
  neuralJournal: {
    id: 'neuralJournal',
    title: 'Neural Journal',
    iconClass: 'icon-bg-journal',
    defaultWidth: 900,
    defaultHeight: 600,
    render: (c) => renderNeuralJournal(c)
  },
  objectives: {
    id: 'objectives',
    title: 'Objectives & Ascent Goals',
    iconClass: 'icon-bg-objectives',
    defaultWidth: 880,
    defaultHeight: 580,
    render: (c) => renderObjectives(c)
  },
  aiAssistant: {
    id: 'aiAssistant',
    title: 'AI Assistant',
    iconClass: 'icon-bg-ai',
    defaultWidth: 800,
    defaultHeight: 620,
    render: (c) => renderAiAssistant(c)
  },
  memoryCore: {
    id: 'memoryCore',
    title: 'Memory Core',
    iconClass: 'icon-bg-memory',
    defaultWidth: 840,
    defaultHeight: 560,
    render: (c) => renderMemoryCore(c)
  },
  systemSettings: {
    id: 'systemSettings',
    title: 'System Settings',
    iconClass: 'icon-bg-settings',
    defaultWidth: 780,
    defaultHeight: 540,
    render: (c, openApp, updateTheme) => renderSystemSettings(c, updateTheme)
  }
};

class WindowManager {
  constructor() {
    this.windowLayer = document.getElementById('window-layer');
    this.openWindows = new Map(); // appId -> DOM Element
    this.topZIndex = 100;
    this.focusedAppId = null;

    this.initClock();
    this.initAppleMenu();
    this.initControlCenter();
    this.initSpotlight();
    this.initDock();
    this.applySettings();

    // Default open Mission Control on boot
    this.openApp('missionControl');
  }

  applySettings() {
    const settings = getSettings();
    document.body.className = settings.wallpaper || 'k2-snow';
  }

  initClock() {
    const clockEl = document.getElementById('top-bar-clock');
    const update = () => {
      const now = new Date();
      if (clockEl) {
        clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    };
    update();
    setInterval(update, 10000);
  }

  initAppleMenu() {
    const btn = document.getElementById('menu-apple-btn');
    const dropdown = document.getElementById('apple-dropdown-menu');

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('hidden');
      document.getElementById('control-center-panel')?.classList.add('hidden');
    });

    document.addEventListener('click', () => {
      dropdown?.classList.add('hidden');
    });

    document.getElementById('dd-about')?.addEventListener('click', () => {
      alert('K2.OS Version 1.0\nBuilt for the Ascent.\nMotto: Build. Learn. Lead.');
    });

    document.getElementById('dd-settings')?.addEventListener('click', () => {
      this.openApp('systemSettings');
    });

    document.getElementById('dd-memory')?.addEventListener('click', () => {
      this.openApp('memoryCore');
    });

    document.getElementById('dd-reload')?.addEventListener('click', () => {
      location.reload();
    });
  }

  initControlCenter() {
    const btn = document.getElementById('btn-control-center');
    const ccPanel = document.getElementById('control-center-panel');

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      ccPanel?.classList.toggle('hidden');
      document.getElementById('apple-dropdown-menu')?.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!ccPanel?.contains(e.target) && e.target !== btn) {
        ccPanel?.classList.add('hidden');
      }
    });

    document.getElementById('cc-tile-wifi')?.addEventListener('click', function() {
      this.classList.toggle('active');
    });

    document.getElementById('cc-tile-bt')?.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }

  initSpotlight() {
    const btn = document.getElementById('btn-spotlight');
    const overlay = document.getElementById('spotlight-overlay');
    const input = document.getElementById('spotlight-input');
    const resultsBox = document.getElementById('spotlight-results-box');

    const toggleSpotlight = (show) => {
      if (show) {
        overlay?.classList.remove('hidden');
        input?.focus();
        if (input) input.value = '';
        renderResults('');
      } else {
        overlay?.classList.add('hidden');
      }
    };

    btn?.addEventListener('click', () => toggleSpotlight(true));

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSpotlight(true);
      } else if (e.key === 'Escape') {
        toggleSpotlight(false);
      }
    });

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) toggleSpotlight(false);
    });

    const renderResults = (query) => {
      const q = query.toLowerCase().trim();
      let html = '';

      // Match Apps
      Object.values(APPS).forEach(app => {
        if (!q || app.title.toLowerCase().includes(q)) {
          html += `
            <div class="sl-item" data-action="app" data-id="${app.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>
              <span>Launch <strong>${app.title}</strong></span>
            </div>
          `;
        }
      });

      // Match Tasks
      if (q) {
        const tasks = getTasks();
        tasks.filter(t => t.title.toLowerCase().includes(q)).forEach(t => {
          html += `
            <div class="sl-item" data-action="app" data-id="objectives">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Objective: <strong>${t.title}</strong> (${t.status})</span>
            </div>
          `;
        });

        // Match Journals
        const journals = getJournals();
        journals.filter(j => j.title.toLowerCase().includes(q) || j.content.toLowerCase().includes(q)).forEach(j => {
          html += `
            <div class="sl-item" data-action="app" data-id="neuralJournal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span>Journal: <strong>${j.title}</strong></span>
            </div>
          `;
        });
      }

      resultsBox.innerHTML = html || '<div class="empty-state">No matching Spotlight results.</div>';

      resultsBox.querySelectorAll('.sl-item').forEach(item => {
        item.addEventListener('click', () => {
          const appId = item.dataset.id;
          if (appId) {
            this.openApp(appId);
            toggleSpotlight(false);
          }
        });
      });
    };

    input?.addEventListener('input', (e) => renderResults(e.target.value));
  }

  initDock() {
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
      item.addEventListener('click', () => {
        const appId = item.dataset.app;
        if (appId) {
          playSound('click');
          this.toggleApp(appId);
        }
      });
    });
  }

  toggleApp(appId) {
    if (this.openWindows.has(appId)) {
      const winEl = this.openWindows.get(appId);
      if (this.focusedAppId === appId && winEl.style.display !== 'none') {
        // Minimize
        winEl.style.display = 'none';
        this.updateDockIndicators();
      } else {
        // Un-minimize and focus
        winEl.style.display = 'flex';
        this.focusWindow(appId);
      }
    } else {
      this.openApp(appId);
    }
  }

  openApp(appId) {
    const appConfig = APPS[appId];
    if (!appConfig) return;

    if (this.openWindows.has(appId)) {
      const winEl = this.openWindows.get(appId);
      winEl.style.display = 'flex';
      this.focusWindow(appId);
      return;
    }

    playSound('open');

    // Build macOS Window DOM
    const winEl = document.createElement('div');
    winEl.className = 'mac-window';
    winEl.id = `win-${appId}`;
    winEl.style.width = `${appConfig.defaultWidth}px`;
    winEl.style.height = `${appConfig.defaultHeight}px`;

    // Center window with cascading offset
    const offset = (this.openWindows.size * 25) % 120;
    const top = Math.max(50, (window.innerHeight - appConfig.defaultHeight) / 2 + offset - 40);
    const left = Math.max(40, (window.innerWidth - appConfig.defaultWidth) / 2 + offset);

    winEl.style.top = `${top}px`;
    winEl.style.left = `${left}px`;

    winEl.innerHTML = `
      <div class="window-header">
        <div class="window-controls">
          <span class="traffic-light tl-red" title="Close"></span>
          <span class="traffic-light tl-yellow" title="Minimize"></span>
          <span class="traffic-light tl-green" title="Maximize"></span>
        </div>
        <span class="window-title">${appConfig.title}</span>
        <div style="width: 52px;"></div> <!-- Spacer -->
      </div>
      <div class="window-body" id="body-${appId}"></div>
    `;

    this.windowLayer.appendChild(winEl);
    this.openWindows.set(appId, winEl);

    // Attach Header Window Dragging
    const headerEl = winEl.querySelector('.window-header');
    this.makeDraggable(winEl, headerEl);

    // Window Controls
    winEl.querySelector('.tl-red').addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeWindow(appId);
    });

    winEl.querySelector('.tl-yellow').addEventListener('click', (e) => {
      e.stopPropagation();
      winEl.style.display = 'none';
      this.updateDockIndicators();
    });

    winEl.querySelector('.tl-green').addEventListener('click', (e) => {
      e.stopPropagation();
      if (winEl.dataset.maximized === 'true') {
        winEl.style.width = winEl.dataset.prevW;
        winEl.style.height = winEl.dataset.prevH;
        winEl.style.top = winEl.dataset.prevT;
        winEl.style.left = winEl.dataset.prevL;
        winEl.dataset.maximized = 'false';
      } else {
        winEl.dataset.prevW = winEl.style.width;
        winEl.dataset.prevH = winEl.style.height;
        winEl.dataset.prevT = winEl.style.top;
        winEl.dataset.prevL = winEl.style.left;

        winEl.style.top = '36px';
        winEl.style.left = '10px';
        winEl.style.width = `${window.innerWidth - 20}px`;
        winEl.style.height = `${window.innerHeight - 130}px`;
        winEl.dataset.maximized = 'true';
      }
    });

    winEl.addEventListener('mousedown', () => {
      this.focusWindow(appId);
    });

    // Render App Content into window body
    const bodyEl = winEl.querySelector(`#body-${appId}`);
    appConfig.render(bodyEl, (targetAppId) => this.openApp(targetAppId), (s) => this.applySettings(s));

    this.focusWindow(appId);
  }

  focusWindow(appId) {
    this.topZIndex++;
    const winEl = this.openWindows.get(appId);
    if (winEl) {
      winEl.style.zIndex = this.topZIndex;
      document.querySelectorAll('.mac-window').forEach(w => w.classList.remove('active-window'));
      winEl.classList.add('active-window');
      this.focusedAppId = appId;

      const appNameEl = document.getElementById('active-app-name');
      if (appNameEl && APPS[appId]) {
        appNameEl.innerText = APPS[appId].title;
      }
    }
    this.updateDockIndicators();
  }

  closeWindow(appId) {
    if (this.openWindows.has(appId)) {
      const winEl = this.openWindows.get(appId);
      winEl.remove();
      this.openWindows.delete(appId);
      playSound('trash');
      this.updateDockIndicators();
    }
  }

  updateDockIndicators() {
    document.querySelectorAll('.dock-item').forEach(item => {
      const appId = item.dataset.app;
      const dot = item.querySelector('.dock-dot');
      if (dot) {
        if (this.openWindows.has(appId)) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      }
    });
  }

  makeDraggable(winEl, handleEl) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handleEl.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('traffic-light')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = winEl.offsetLeft;
      initialTop = winEl.offsetTop;
      document.body.style.cursor = 'move';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      winEl.style.left = `${initialLeft + dx}px`;
      winEl.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
      }
    });
  }
}

// Boot K2.OS on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  window.K2OS = new WindowManager();
});
