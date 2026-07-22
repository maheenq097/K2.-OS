// API Service Module for K2.OS Backend Integration

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API Fetch Helper with JSON headers & error handling
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Optional: Attach JWT Auth token if available
  const token = localStorage.getItem('k2_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API Error - ${endpoint}]:`, error);
    throw error;
  }
}

// -------------------------------------------------------------
// BACKEND API ENDPOINTS
// -------------------------------------------------------------

export const api = {
  // 1. Altitude & Basecamp Progress
  getAltitude: () => request('/altitude'),
  updateAltitude: (meters) => request('/altitude', { method: 'PUT', body: JSON.stringify({ meters }) }),

  // 2. Objectives Engine
  getObjectives: () => request('/objectives'),
  createObjective: (data) => request('/objectives', { method: 'POST', body: JSON.stringify(data) }),
  updateObjectiveStage: (id, stage) => request(`/objectives/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
  toggleSubtask: (objId, subtaskId) => request(`/objectives/${objId}/subtasks/${subtaskId}`, { method: 'PATCH' }),
  deleteObjective: (id) => request(`/objectives/${id}`, { method: 'DELETE' }),

  // 3. Memory Core Context Graph
  getMemories: () => request('/memories'),
  createMemory: (data) => request('/memories', { method: 'POST', body: JSON.stringify(data) }),
  deleteMemory: (id) => request(`/memories/${id}`, { method: 'DELETE' }),

  // 4. Neural Journal
  getJournals: () => request('/journals'),
  createJournal: (data) => request('/journals', { method: 'POST', body: JSON.stringify(data) }),

  // 5. K2 Basecamp AI Assistant Chat
  sendAIChat: (message, context) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),

  // 6. Future Systems Sync
  syncSystem: (systemId) => request(`/systems/${systemId}/sync`, { method: 'POST' })
};

export default api;
