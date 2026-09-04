// AI Assistant App Component - K2.OS Second Brain & Conversational Assistant

import { getProfile, getInterests, getProjects, getTasks, getJournals, getChatHistory, saveChatHistory } from '../storage.js';
import { playSound } from '../soundManager.js';

export function renderAiAssistant(container) {
  let chatHistory = getChatHistory();

  function render() {
    const profile = getProfile();
    const interests = getInterests();
    const projects = getProjects();
    const tasks = getTasks();
    const journals = getJournals();

    container.innerHTML = `
      <div class="ai-assistant-app">
        <!-- Memory Core Context Banner -->
        <div class="ai-memory-badge">
          <div class="amb-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-slow"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span><strong>Memory Core Active:</strong> Injected context for <em>${escapeHtml(profile.name)}</em> (${interests.length} interests, ${projects.length} projects, ${tasks.filter(t=>t.status==='Pending').length} pending objectives)</span>
          </div>
          <span class="badge badge-success">Context Aware</span>
        </div>

        <!-- Chat Stream -->
        <div class="chat-messages" id="chat-messages-box">
          ${chatHistory.map(msg => `
            <div class="chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}">
              <div class="cb-header">
                <span class="cb-name">${msg.sender === 'user' ? escapeHtml(profile.name) : 'K2 AI Assistant'}</span>
                <span class="cb-time">${escapeHtml(msg.time || '')}</span>
              </div>
              <div class="cb-text">${msg.text}</div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Prompt Chips -->
        <div class="quick-prompts-bar">
          <span class="qp-chip" data-prompt="Summarize my current pending objectives and priorities.">📋 Summarize Objectives</span>
          <span class="qp-chip" data-prompt="What insights can you synthesize from my Neural Journal?">🧠 Journal Insights</span>
          <span class="qp-chip" data-prompt="How can I better align my daily work with my K2 mountain goal?">🏔️ Ascent Planning</span>
          <span class="qp-chip" data-prompt="Show me my Memory Core profile context.">💾 Memory Core Status</span>
        </div>

        <!-- Chat Input Form -->
        <div class="chat-input-row">
          <input type="text" id="chat-user-input" class="form-input" placeholder="Ask K2 AI Assistant anything about your goals, tasks, or ideas..." autocomplete="off">
          <button class="btn btn-primary" id="btn-send-chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send
          </button>
          <button class="btn btn-secondary btn-icon" id="btn-clear-chat" title="Clear Chat History">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;

    attachListeners();
    scrollToBottom();
  }

  function scrollToBottom() {
    const box = container.querySelector('#chat-messages-box');
    if (box) box.scrollTop = box.scrollHeight;
  }

  function handleSendMessage(textInput) {
    const text = textInput || container.querySelector('#chat-user-input')?.value.trim();
    if (!text) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    chatHistory.push({
      sender: 'user',
      text: escapeHtml(text),
      time: timeNow
    });

    saveChatHistory(chatHistory);
    playSound('click');
    render();

    // Generate Context-Aware Response
    setTimeout(() => {
      const profile = getProfile();
      const interests = getInterests();
      const projects = getProjects();
      const pendingTasks = getTasks().filter(t => t.status === 'Pending');
      const journals = getJournals();

      let aiResponseText = '';
      const queryLower = text.toLowerCase();

      if (queryLower.includes('objective') || queryLower.includes('task') || queryLower.includes('todo')) {
        aiResponseText = `Here is your current Objectives summary, <strong>${escapeHtml(profile.name)}</strong>:<br><br>` +
          `• You currently have <strong>${pendingTasks.length} pending objectives</strong>.<br>` +
          pendingTasks.map(t => `- [${t.priority}] ${escapeHtml(t.title)} (${escapeHtml(t.category)})`).join('<br>') +
          `<br><br><em>Tip: Focus on completing high-priority objectives first to maintain ascent momentum!</em>`;
      } else if (queryLower.includes('journal') || queryLower.includes('reflection') || queryLower.includes('insight')) {
        aiResponseText = `I analyzed your <strong>${journals.length} Neural Journal entries</strong>:<br><br>` +
          `• Latest reflection: "<em>${escapeHtml(journals[0]?.title || 'None')}</em>"<br>` +
          `• <strong>Key Theme:</strong> System architecture, disciplined learning, and building K2.OS.<br>` +
          `• <strong>AI Insight:</strong> You show high clarity when breaking down complex goals into daily execution blocks. Keep capturing your reflections!`;
      } else if (queryLower.includes('memory') || queryLower.includes('profile') || queryLower.includes('status')) {
        aiResponseText = `<strong>Memory Core Injected Context:</strong><br><br>` +
          `• <strong>User Profile:</strong> ${escapeHtml(profile.name)} (${escapeHtml(profile.role)})<br>` +
          `• <strong>Motto:</strong> "${escapeHtml(profile.motto)}"<br>` +
          `• <strong>Mountain Goal:</strong> ${escapeHtml(profile.mountainGoal)}<br>` +
          `• <strong>Interests (${interests.length}):</strong> ${interests.join(', ')}<br>` +
          `• <strong>Projects (${projects.length}):</strong> ${projects.map(p=>p.title).join(', ')}`;
      } else if (queryLower.includes('k2') || queryLower.includes('ascent') || queryLower.includes('goal')) {
        aiResponseText = `<em>"Build. Learn. Lead."</em><br><br>` +
          `Your stated mountain goal is: <strong>${escapeHtml(profile.mountainGoal)}</strong>.<br>` +
          `To conquer K2, discipline and adaptability are required every single day. Align your ${pendingTasks.length} pending tasks with your primary project <strong>${escapeHtml(projects[0]?.title || 'K2.OS')}</strong>.`;
      } else {
        aiResponseText = `I have received your prompt and processed it against your <strong>Memory Core profile</strong> (${escapeHtml(profile.name)}).<br><br>` +
          `You are working towards: "<em>${escapeHtml(profile.mountainGoal)}</em>".<br>` +
          `I am ready to help you brainstorm, draft notes, or structure your next objective. What specific step should we take next?`;
      }

      chatHistory.push({
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        memoryInjected: true
      });

      saveChatHistory(chatHistory);
      playSound('open');
      render();
    }, 600);
  }

  function attachListeners() {
    const btnSend = container.querySelector('#btn-send-chat');
    const userInput = container.querySelector('#chat-user-input');

    if (btnSend && userInput) {
      btnSend.addEventListener('click', () => handleSendMessage());
      userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSendMessage();
      });
    }

    // Quick prompt chips
    container.querySelectorAll('.qp-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        handleSendMessage(chip.dataset.prompt);
      });
    });

    // Clear chat
    const btnClear = container.querySelector('#btn-clear-chat');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Clear AI Assistant conversation history?')) {
          chatHistory = [];
          saveChatHistory(chatHistory);
          playSound('trash');
          render();
        }
      });
    }
  }

  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
