import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import {
  Sparkles,
  Send,
  Brain,
  Target,
  BookOpen,
  Compass,
  Cpu,
  Bot,
  User
} from 'lucide-react';
import './AIView.css';

export const AIView = () => {
  const {
    chatMessages,
    sendMessageToAI,
    memories,
    objectives,
    journals
  } = useOS();

  const [input, setInput] = useState('');
  const [includeMemories, setIncludeMemories] = useState(true);
  const [includeObjectives, setIncludeObjectives] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const quickPrompts = [
    "Analyze my current workload and prioritize objectives",
    "How can I optimize my 8:00 AM deep work window?",
    "Summarize my recent Neural Journal reflections",
    "Identify connections between my Memory Core context nodes"
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessageToAI(input);
    setInput('');
  };

  const handleQuickPromptClick = (promptText) => {
    sendMessageToAI(promptText);
  };

  return (
    <div className="ai-view-container glass-panel">
      {/* AI Assistant Header */}
      <div className="ai-header">
        <div className="ai-title-group">
          <div className="ai-avatar-badge">
            <Bot size={22} className="color-cyan" />
          </div>
          <div>
            <h3>K2 Basecamp AI Assistant</h3>
            <p>Second Brain Command Center & Autonomous Context Navigator</p>
          </div>
        </div>

        {/* Live Context Toggles */}
        <div className="context-toggles">
          <button
            className={`ctx-pill ${includeMemories ? 'active' : ''}`}
            onClick={() => setIncludeMemories(!includeMemories)}
          >
            <Brain size={14} /> Memory Core ({memories.length})
          </button>
          <button
            className={`ctx-pill ${includeObjectives ? 'active' : ''}`}
            onClick={() => setIncludeObjectives(!includeObjectives)}
          >
            <Target size={14} /> Objectives ({objectives.length})
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="chat-messages-feed">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-msg-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
          >
            <div className="msg-avatar">
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className="msg-bubble glass-panel">
              <div className="msg-meta">
                <span className="msg-sender-name">
                  {msg.sender === 'user' ? 'Climber' : 'K2 Basecamp AI'}
                </span>
                <span className="msg-time">{msg.timestamp}</span>
              </div>
              <div className="msg-text">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="quick-prompts-bar">
        <span className="prompt-label"><Sparkles size={14} className="color-violet" /> Quick Queries:</span>
        {quickPrompts.map((promptText, i) => (
          <button
            key={i}
            className="prompt-chip"
            onClick={() => handleQuickPromptClick(promptText)}
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="ai-input-form">
        <input
          type="text"
          placeholder="Ask K2 AI anything about your goals, notes, or climbing strategy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary ai-send-btn">
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
};
