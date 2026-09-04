// System Settings App Component - K2.OS Preferences & Wallpaper Swapper

import { getSettings, saveSettings, resetAllData } from '../storage.js';
import { playSound } from '../soundManager.js';

export function renderSystemSettings(container, onSettingsChanged) {
  let settings = getSettings();

  function render() {
    container.innerHTML = `
      <div class="settings-app">
        <div class="settings-sidebar">
          <div class="ss-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>System Settings</span>
          </div>
          <div class="ss-menu">
            <div class="ss-item active">Appearance & Wallpaper</div>
            <div class="ss-item" id="btn-ss-about">About K2.OS</div>
          </div>
        </div>

        <div class="settings-content">
          <h2>Desktop Wallpapers & Aesthetics</h2>
          <p>Choose your basecamp visual ambiance for the ascent.</p>

          <div class="wallpaper-grid" style="margin-top: 15px;">
            <div class="wp-card ${settings.wallpaper === 'k2-snow' ? 'active' : ''}" data-wp="k2-snow">
              <div class="wp-preview wp-k2-snow"></div>
              <span>K2 Snowy Summit Dark</span>
            </div>

            <div class="wp-card ${settings.wallpaper === 'k2-sunset' ? 'active' : ''}" data-wp="k2-sunset">
              <div class="wp-preview wp-k2-sunset"></div>
              <span>K2 Golden Sunset</span>
            </div>

            <div class="wp-card ${settings.wallpaper === 'sequoia-lake' ? 'active' : ''}" data-wp="sequoia-lake">
              <div class="wp-preview wp-sequoia-lake"></div>
              <span>Sequoia Forest Blue</span>
            </div>

            <div class="wp-card ${settings.wallpaper === 'studio-light' ? 'active' : ''}" data-wp="studio-light">
              <div class="wp-preview wp-studio-light"></div>
              <span>Studio Light Minimal</span>
            </div>

            <div class="wp-card ${settings.wallpaper === 'cyber-aurora' ? 'active' : ''}" data-wp="cyber-aurora">
              <div class="wp-preview wp-cyber-aurora"></div>
              <span>Cyber Aurora Neon</span>
            </div>
          </div>

          <h3 style="margin-top: 25px;">Audio & Sound Effects</h3>
          <div class="setting-toggle-row">
            <span>Enable UI Audio Feedback (Clicks, chimes, window snapping)</span>
            <label class="toggle-switch">
              <input type="checkbox" id="chk-sound" ${settings.soundEnabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <h3 style="margin-top: 25px;">System Data Management</h3>
          <p>Reset local storage data to factory default proof-of-concept state.</p>
          <button class="btn btn-secondary" id="btn-reset-data" style="margin-top: 10px; color: var(--danger);">
            Reset K2.OS Data
          </button>
        </div>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Wallpaper Selection
    container.querySelectorAll('.wp-card').forEach(card => {
      card.addEventListener('click', () => {
        settings.wallpaper = card.dataset.wp;
        saveSettings(settings);
        playSound('open');
        if (onSettingsChanged) onSettingsChanged(settings);
        render();
      });
    });

    // Sound toggle
    const chkSound = container.querySelector('#chk-sound');
    if (chkSound) {
      chkSound.addEventListener('change', () => {
        settings.soundEnabled = chkSound.checked;
        saveSettings(settings);
        if (chkSound.checked) playSound('click');
        if (onSettingsChanged) onSettingsChanged(settings);
      });
    }

    // Reset data
    const btnReset = container.querySelector('#btn-reset-data');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all K2.OS data to defaults?')) {
          resetAllData();
        }
      });
    }
  }

  render();
}
