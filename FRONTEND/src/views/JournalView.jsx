import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import {
  BookOpen,
  Sparkles,
  Smile,
  Tag,
  Clock,
  Plus,
  Send,
  CheckCircle2,
  FileText
} from 'lucide-react';
import './JournalView.css';

export const JournalView = () => {
  const { journals, addJournal } = useOS();

  // Active Entry Editor State
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('Focused');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('Reflections, Climbing');
  const [selectedJournal, setSelectedJournal] = useState(journals[0] || null);

  const moods = ['Energized', 'Focused', 'Calm', 'Challenged', 'Reflective'];

  const promptTemplates = [
    {
      name: "Weekly Retrospective",
      template: "## Peak Wins This Week\n- \n\n## Climbing Obstacles Encountered\n- \n\n## Key Learnings to Store in Memory Core\n- "
    },
    {
      name: "Brainstorming Session",
      template: "## Problem / Concept\n\n## Potential Solutions\n1. \n2. \n\n## Next Altitude Step\n- "
    },
    {
      name: "Climbing Obstacles",
      template: "## What is creating friction right now?\n\n## What is within my direct control?\n\n## Immediate Action Plan\n- "
    }
  ];

  const handleApplyTemplate = (tmpl) => {
    setTitle(tmpl.name);
    setContent(tmpl.template);
  };

  const handleSaveJournal = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    addJournal({
      title,
      mood,
      content,
      tags: parsedTags
    });

    setTitle('');
    setContent('');
  };

  return (
    <div className="journal-container">
      {/* Left Column: Editor & AI Drawer */}
      <div className="journal-editor-section glass-panel">
        <div className="editor-header">
          <div className="editor-title-group">
            <h3><BookOpen size={18} className="color-gold" /> Neural Reflection Writer</h3>
            <span className="badge badge-gold">AI Synthesis Active</span>
          </div>

          <div className="template-chips">
            <span className="tmpl-label"><FileText size={12} /> Templates:</span>
            {promptTemplates.map((tmpl) => (
              <button
                key={tmpl.name}
                className="tmpl-chip"
                onClick={() => handleApplyTemplate(tmpl)}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSaveJournal} className="journal-form">
          <div className="form-row-two">
            <div className="form-group flex-2">
              <label>Reflection Title</label>
              <input
                type="text"
                placeholder="e.g. Camp 2 Basecamp Retrospective"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label>Current Mindset / Mood</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)}>
                {moods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Reflection Content (Markdown Supported)</label>
            <textarea
              rows="7"
              placeholder="Write your thoughts, ideas, or reflection here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-row-two align-end">
            <div className="form-group flex-2">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Climbing, Architecture, Focus"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary save-journal-btn">
              <Send size={16} /> Log Entry (+100m Altitude)
            </button>
          </div>
        </form>

        {/* Real-time AI Insight Preview */}
        {selectedJournal && (
          <div className="ai-insight-box">
            <div className="insight-header">
              <Sparkles size={16} className="color-violet" />
              <h4>AI Synthesis & Sentiment Insights for "{selectedJournal.title}"</h4>
            </div>

            <div className="insight-grid">
              <div className="insight-card">
                <span className="ins-lbl">Extracted Sentiment</span>
                <span className="ins-val color-cyan">{selectedJournal.aiInsights?.sentiment}</span>
              </div>
              <div className="insight-card">
                <span className="ins-lbl">Identified Key Themes</span>
                <div className="theme-tags">
                  {selectedJournal.aiInsights?.keyThemes?.map((theme, i) => (
                    <span key={i} className="badge badge-violet">{theme}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="insight-advice">
              <strong><CheckCircle2 size={14} className="color-emerald" /> Actionable Guidance: </strong>
              {selectedJournal.aiInsights?.actionableAdvice}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Timeline Archive */}
      <div className="journal-archive-section glass-panel">
        <div className="archive-header">
          <h3><Clock size={16} /> Journal Archive</h3>
          <span className="badge badge-cyan">{journals.length} Entries</span>
        </div>

        <div className="journal-timeline">
          {journals.map((entry) => (
            <div
              key={entry.id}
              className={`timeline-item ${selectedJournal?.id === entry.id ? 'active' : ''}`}
              onClick={() => setSelectedJournal(entry)}
            >
              <div className="item-meta">
                <span className="item-date">{entry.date}</span>
                <span className="badge badge-gold">{entry.mood}</span>
              </div>

              <h4 className="item-title">{entry.title}</h4>
              <p className="item-snippet">{entry.content.slice(0, 100)}...</p>

              <div className="item-tags">
                {entry.tags.map((t) => (
                  <span key={t} className="item-tag">#{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
