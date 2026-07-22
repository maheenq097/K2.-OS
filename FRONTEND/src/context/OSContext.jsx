import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ALTITUDE,
  INITIAL_OBJECTIVES,
  INITIAL_MEMORIES,
  INITIAL_JOURNALS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_FUTURE_SYSTEMS
} from '../utils/initialData';
import { toggleAmbientAudio, playSuccessChime } from '../utils/soundEffects';

const OSContext = createContext();

export const OSProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Load state from localStorage or initial fallback
  const [altitude, setAltitude] = useState(() => {
    const saved = localStorage.getItem('k2_altitude');
    return saved ? JSON.parse(saved) : INITIAL_ALTITUDE;
  });

  const [objectives, setObjectives] = useState(() => {
    const saved = localStorage.getItem('k2_objectives');
    return saved ? JSON.parse(saved) : INITIAL_OBJECTIVES;
  });

  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('k2_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [journals, setJournals] = useState(() => {
    const saved = localStorage.getItem('k2_journals');
    return saved ? JSON.parse(saved) : INITIAL_JOURNALS;
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('k2_chatMessages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [futureSystems, setFutureSystems] = useState(() => {
    const saved = localStorage.getItem('k2_futureSystems');
    return saved ? JSON.parse(saved) : INITIAL_FUTURE_SYSTEMS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('k2_altitude', JSON.stringify(altitude));
  }, [altitude]);

  useEffect(() => {
    localStorage.setItem('k2_objectives', JSON.stringify(objectives));
  }, [objectives]);

  useEffect(() => {
    localStorage.setItem('k2_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('k2_journals', JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem('k2_chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('k2_futureSystems', JSON.stringify(futureSystems));
  }, [futureSystems]);

  // Global Keyboard Short-cuts (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio Toggle
  const handleToggleSoundscape = () => {
    const newState = toggleAmbientAudio(setIsAudioPlaying);
  };

  // Objective Actions
  const addObjective = (newObj) => {
    const objWithDefaults = {
      id: `obj-${Date.now()}`,
      stage: 'basecamp',
      subtasks: [],
      altitudeImpact: 200,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      ...newObj
    };
    setObjectives((prev) => [objWithDefaults, ...prev]);
    playSuccessChime();
  };

  const toggleSubtask = (objId, subtaskId) => {
    setObjectives((prev) =>
      prev.map((obj) => {
        if (obj.id !== objId) return obj;
        const updatedSubtasks = obj.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        
        // If all subtasks completed, boost altitude!
        const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
        if (allDone && obj.stage !== 'summit') {
          increaseAltitude(obj.altitudeImpact || 150);
          playSuccessChime();
        }

        return { ...obj, subtasks: updatedSubtasks };
      })
    );
  };

  const updateObjectiveStage = (objId, newStage) => {
    setObjectives((prev) =>
      prev.map((obj) => {
        if (obj.id === objId) {
          if (newStage === 'summit' && obj.stage !== 'summit') {
            increaseAltitude(obj.altitudeImpact || 300);
            playSuccessChime();
          }
          return { ...obj, stage: newStage };
        }
        return obj;
      })
    );
  };

  const deleteObjective = (objId) => {
    setObjectives((prev) => prev.filter((o) => o.id !== objId));
  };

  // Memory Actions
  const addMemory = (newMemory) => {
    const memoryItem = {
      id: `mem-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      strength: 95,
      connectedNodeIds: memories.slice(0, 2).map((m) => m.id),
      tags: newMemory.tags || ["Context"],
      ...newMemory
    };
    setMemories((prev) => [memoryItem, ...prev]);
    playSuccessChime();
  };

  const deleteMemory = (memId) => {
    setMemories((prev) => prev.filter((m) => m.id !== memId));
  };

  // Journal Actions
  const addJournal = (newJournal) => {
    // Generate AI analysis simulation
    const keywords = (newJournal.content || "").toLowerCase();
    let sentiment = "Reflective & Clear (82%)";
    if (keywords.includes("stress") || keywords.includes("hard") || keywords.includes("difficult")) {
      sentiment = "Challenged & Resilient (76%)";
    } else if (keywords.includes("great") || keywords.includes("accomplished") || keywords.includes("excited")) {
      sentiment = "High Energy & Optimistic (92%)";
    }

    const journalItem = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: newJournal.mood || "Focused",
      tags: newJournal.tags || ["Reflection"],
      aiInsights: {
        sentiment,
        keyThemes: [newJournal.title, "Personal Development", "Climbing Milestones"],
        actionableAdvice: "Consolidate today's learnings into Memory Core and review tomorrow's summit tasks."
      },
      ...newJournal
    };
    setJournals((prev) => [journalItem, ...prev]);
    increaseAltitude(100);
    playSuccessChime();
  };

  // Altitude Helper
  const increaseAltitude = (meters) => {
    setAltitude((prev) => ({
      ...prev,
      currentMeters: Math.min(prev.maxMeters, prev.currentMeters + meters)
    }));
  };

  // AI Chat Helper
  const sendMessageToAI = (userText) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Intelligent context-aware AI response simulation
    setTimeout(() => {
      let aiText = `I have analyzed your request against your K2 Memory Core (${memories.length} active nodes) and your current Summit Progress (${altitude.currentMeters}m / 8,611m).\n\n`;

      const lower = userText.toLowerCase();
      if (lower.includes('workload') || lower.includes('tasks') || lower.includes('objective')) {
        const pending = objectives.filter(o => o.stage !== 'summit');
        aiText += `You currently have ${pending.length} pending objectives. Your top priority is "${pending[0]?.title || 'Weekly Review'}". I recommend completing its subtasks during your 8:00 AM deep work window.`;
      } else if (lower.includes('journal') || lower.includes('reflect')) {
        aiText += `Your last Neural Journal entry noted: "${journals[0]?.title || 'Basecamp Reflections'}". You seem in a ${journals[0]?.mood || 'focused'} state. Keep pushing forward!`;
      } else if (lower.includes('memory') || lower.includes('context')) {
        aiText += `Memory Core is active. I remember your key interests: ${memories.map(m => m.topic).join(', ')}.`;
      } else {
        aiText += `Based on your K2 philosophy, life is an ambitious mountain climb. Focus on high-altitude impact tasks and break them down step-by-step. What specific milestone shall we tackle next?`;
      }

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiText
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      playSuccessChime();
    }, 600);
  };

  // Toggle Future Systems Connections
  const toggleSystemConnection = (sysId) => {
    setFutureSystems((prev) =>
      prev.map((sys) =>
        sys.id === sysId ? { ...sys, connected: !sys.connected } : sys
      )
    );
  };

  return (
    <OSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAudioPlaying,
        handleToggleSoundscape,
        altitude,
        objectives,
        addObjective,
        toggleSubtask,
        updateObjectiveStage,
        deleteObjective,
        memories,
        addMemory,
        deleteMemory,
        journals,
        addJournal,
        chatMessages,
        sendMessageToAI,
        futureSystems,
        toggleSystemConnection
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => useContext(OSContext);
