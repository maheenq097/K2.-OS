// Storage Manager for K2.OS Version 1 - Backend API Sync & Local Storage Persistence
// Connects frontend to http://localhost:3000 REST API

const API_BASE = 'http://localhost:3000/api';

const STORAGE_KEYS = {
  PROFILE: 'k2os_profile',
  INTERESTS: 'k2os_interests',
  PROJECTS: 'k2os_projects',
  TASKS: 'k2os_tasks',
  JOURNAL: 'k2os_journal',
  SETTINGS: 'k2os_settings',
  CHAT_HISTORY: 'k2os_chat_history'
};

const DEFAULT_PROFILE = {
  name: 'Alex Vance',
  role: 'Founder & Software Engineer',
  motto: 'Build. Learn. Lead.',
  mountainGoal: 'Conquer K2 - Launching K2.OS Personal Operating System',
  joinedDate: 'Summer 2026'
};

const DEFAULT_INTERESTS = [
  'Artificial Intelligence & LLMs',
  'System Architecture',
  'Human-Computer Interaction',
  'High-Altitude Expedition Philosophy',
  'Productivity Engineering',
  'Full-Stack Web Development'
];

const DEFAULT_PROJECTS = [
  { id: 'proj-1', title: 'K2.OS Version 1 Proof of Concept', status: 'In Progress', goal: 'Establish personal AI operating system foundation by end of Summer 2026' },
  { id: 'proj-2', title: 'Neural Memory Core Integration', status: 'Active', goal: 'Inject persistent user context into AI chat' },
  { id: 'proj-3', title: 'Apple Interface Design System', status: 'Completed', goal: 'Build pixel-perfect macOS/iOS glassmorphic frontend' }
];

const DEFAULT_TASKS = [
  { id: 'task-1', title: 'Test K2.OS Neural Journal & AI Assistant', priority: 'High', category: 'Project', status: 'Pending', dueDate: '2026-08-15' },
  { id: 'task-2', title: 'Refine Memory Core profile & interest tags', priority: 'Medium', category: 'Personal', status: 'Pending', dueDate: '2026-08-18' },
  { id: 'task-3', title: 'Verify GitHub repository synchronization', priority: 'High', category: 'Project', status: 'Completed', dueDate: '2026-08-09' }
];

const DEFAULT_JOURNALS = [
  {
    id: 'j-1',
    title: 'The Philosophy Behind K2.OS',
    tag: 'Reflection',
    date: '2026-08-09 14:30',
    content: `Unlike Everest, K2 is known for being difficult, demanding, and unforgiving. Success requires preparation, discipline, teamwork, adaptability, and resilience.\n\nEveryone is climbing their own mountain. K2.OS is intended to act as a personal basecamp, navigation system, and command center for that journey.`
  }
];

const DEFAULT_SETTINGS = {
  theme: 'dark',
  wallpaper: 'k2-snow',
  soundEnabled: true,
  volume: 0.6
};

// Async Backend Sync Helper
export async function syncWithBackend() {
  try {
    const res = await fetch(`${API_BASE}/db`);
    if (res.ok) {
      const data = await res.json();
      if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
      if (data.journals) localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(data.journals));
      if (data.interests) localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(data.interests));
      if (data.projects) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      if (data.chatHistory) localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(data.chatHistory));
      return data;
    }
  } catch (e) {
    // Local fallback if offline
  }
  return null;
}

// Auto sync on boot
syncWithBackend();

// Sync functions
export function getItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

export function getProfile() {
  return getItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
}

export function saveProfile(profile) {
  setItem(STORAGE_KEYS.PROFILE, profile);
  fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  }).catch(() => {});
}

export function getInterests() {
  return getItem(STORAGE_KEYS.INTERESTS, DEFAULT_INTERESTS);
}

export function saveInterests(interests) {
  setItem(STORAGE_KEYS.INTERESTS, interests);
}

export function getProjects() {
  return getItem(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
}

export function saveProjects(projects) {
  setItem(STORAGE_KEYS.PROJECTS, projects);
}

export function getTasks() {
  return getItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
}

export function saveTasks(tasks) {
  setItem(STORAGE_KEYS.TASKS, tasks);
}

export function saveSingleTask(task) {
  fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).catch(() => {});
}

export function deleteTaskBackend(taskId) {
  fetch(`${API_BASE}/tasks?id=${taskId}`, { method: 'DELETE' }).catch(() => {});
}

export function getJournals() {
  return getItem(STORAGE_KEYS.JOURNAL, DEFAULT_JOURNALS);
}

export function saveJournals(journals) {
  setItem(STORAGE_KEYS.JOURNAL, journals);
}

export function saveSingleJournal(journal) {
  fetch(`${API_BASE}/journals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(journal)
  }).catch(() => {});
}

export function deleteJournalBackend(jId) {
  fetch(`${API_BASE}/journals?id=${jId}`, { method: 'DELETE' }).catch(() => {});
}

export function getSettings() {
  return getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings) {
  setItem(STORAGE_KEYS.SETTINGS, settings);
}

export function getChatHistory() {
  return getItem(STORAGE_KEYS.CHAT_HISTORY, [
    {
      sender: 'ai',
      text: 'Welcome to K2.OS Version 1 — Connected Backend Active on localhost:3000. How can I assist with your ascent today?',
      time: '12:00 PM',
      memoryInjected: true
    }
  ]);
}

export function saveChatHistory(history) {
  setItem(STORAGE_KEYS.CHAT_HISTORY, history);
}

export async function askAiBackend(message) {
  try {
    const res = await fetch(`${API_BASE}/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return null;
}

export function resetAllData() {
  fetch(`${API_BASE}/reset`, { method: 'POST' }).catch(() => {});
  localStorage.clear();
  location.reload();
}
