import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';
import {
  Brain,
  Plus,
  Tag,
  Trash2,
  Sparkles,
  Share2,
  Search,
  Filter
} from 'lucide-react';
import './MemoryView.css';

export const MemoryView = () => {
  const { memories, addMemory, deleteMemory, searchQuery } = useOS();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Memory Form State
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Interests');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const canvasRef = useRef(null);

  // Filter memories
  const categories = ['All', 'Values', 'Interests', 'Preferences', 'Academics'];
  const filteredMemories = memories.filter((mem) => {
    const matchesCategory = selectedCategory === 'All' || mem.category === selectedCategory;
    const matchesSearch =
      mem.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Canvas Node Graph Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    // Set canvas dimensions
    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = 280);

    // Node positioning math
    const nodes = memories.map((mem, index) => {
      const angle = (index / memories.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      return {
        id: mem.id,
        topic: mem.topic,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * (radius * 0.6),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 12 + Math.min(mem.strength / 10, 10),
        category: mem.category
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Connections
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Draw & Update Nodes
      nodes.forEach((node) => {
        // Move slightly
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 40 || node.x > width - 40) node.vx *= -1;
        if (node.y < 40 || node.y > height - 40) node.vy *= -1;

        // Glow circle
        const isSelected = selectedMemory?.id === node.id;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? 'rgba(0, 242, 254, 0.9)'
          : 'rgba(139, 92, 246, 0.7)';
        ctx.fill();

        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.strokeStyle = '#00F2FE';
        ctx.stroke();

        // Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = '11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.topic.slice(0, 16), node.x, node.y + node.radius + 14);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [memories, selectedMemory]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!topic || !content) return;

    const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    addMemory({
      topic,
      category,
      content,
      tags: parsedTags.length ? parsedTags : ['Context']
    });

    setTopic('');
    setContent('');
    setTagsInput('');
    setShowAddModal(false);
  };

  return (
    <div className="memory-container">
      {/* Visual Context Graph Header */}
      <div className="graph-banner glass-panel">
        <div className="graph-banner-header">
          <div className="title-area">
            <h3><Share2 size={18} className="color-cyan" /> Interactive Context Graph</h3>
            <p>Persistent memory system that provides long-term context to K2 Basecamp AI.</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} /> Store New Memory
          </button>
        </div>

        {/* Canvas Graph View */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Category Tabs & Vault Grid */}
      <div className="vault-section">
        <div className="vault-controls">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="vault-count">
            Showing {filteredMemories.length} of {memories.length} Context Nodes
          </span>
        </div>

        <div className="memories-grid">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className={`memory-card glass-panel glass-panel-interactive ${selectedMemory?.id === mem.id ? 'selected' : ''}`}
              onClick={() => setSelectedMemory(mem)}
            >
              <div className="mem-card-top">
                <span className="badge badge-violet">{mem.category}</span>
                <button
                  className="delete-mem-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMemory(mem.id);
                  }}
                  title="Delete memory node"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 className="mem-card-title">{mem.topic}</h4>
              <p className="mem-card-content">{mem.content}</p>

              <div className="mem-card-footer">
                <div className="mem-tags">
                  {mem.tags.map((tag) => (
                    <span key={tag} className="mem-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="mem-strength">Strength: {mem.strength}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Brain size={18} className="color-cyan" /> Store Personal Memory Node</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label>Memory Topic / Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Deep Work Morning Ritual"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Values">Values</option>
                  <option value="Interests">Interests</option>
                  <option value="Preferences">Preferences</option>
                  <option value="Academics">Academics</option>
                </select>
              </div>

              <div className="form-group">
                <label>Context Detail & Content</label>
                <textarea
                  rows="4"
                  placeholder="Describe your preference, goal, or context knowledge for AI retrieval..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Focus, Morning, Routine"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Store Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
