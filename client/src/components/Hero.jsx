import React, { useState } from 'react';
import { ArrowRight, Play, Database, MessageSquare, Zap, Cpu } from 'lucide-react';
import './Hero.css';

export default function Hero({ onCtaClick }) {
  const [activeNode, setActiveNode] = useState(null);

  const handleCTA = (e) => {
    e.preventDefault();
    const element = document.getElementById('lead-form');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });

      if (onCtaClick) {
        onCtaClick();
      }
    }
  };

  const handleSecondary = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const nodes = [
    { id: 1, title: 'Lead Captured', icon: <MessageSquare size="1.2em" />, desc: 'Form submission received', color: 'var(--color-secondary)' },
    { id: 2, title: 'AI Classifier', icon: <Cpu size="1.2em" />, desc: 'Checks sentiment & intent', color: 'var(--color-primary)' },
    { id: 3, title: 'SQLite Database', icon: <Database size="1.2em" />, desc: 'Saves lead details securely', color: 'var(--color-success)' },
    { id: 4, title: 'Auto-Response', icon: <Zap size="1.2em" />, desc: 'Dispatches instant alert', color: '#f59e0b' }
  ];

  return (
    <section id="hero" className="hero-section section animate-fadeIn">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="tagline">Introducing AetherFlow 2.0</span>
          <h1 className="hero-title">
            Orchestrate Your Workflows with <span className="text-gradient">AI Intellect</span>
          </h1>
          <p className="hero-desc">
            AetherFlow bridges the gap between raw data streams and automated SaaS execution. Capture leads, classify insights, and write data directly to your SQLite core database in real-time.
          </p>
          <div className="hero-actions">
            <a href="#lead-form" onClick={handleCTA} className="btn btn-primary">
              Build a Flow <ArrowRight size="1.1em" />
            </a>
            <a href="#features" onClick={handleSecondary} className="btn btn-secondary">
              <Play size="1em" /> Explore Features
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="flow-canvas glassmorphic-panel animate-float">
            <div className="flow-canvas-header">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="window-title">AetherFlow Builder — lead_ingestion.flow</span>
            </div>

            <div className="flow-nodes">
              {nodes.map((node) => (
                <div 
                  key={node.id} 
                  className={`flow-node ${activeNode === node.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  style={{ '--node-theme': node.color }}
                >
                  <div className="node-icon-wrapper" style={{ backgroundColor: node.color + '15', color: node.color }}>
                    {node.icon}
                  </div>
                  <div className="node-details">
                    <h4>{node.title}</h4>
                    <p>{node.desc}</p>
                  </div>
                  {node.id < 4 && (
                    <div className="node-connection-line">
                      <span className="connection-pulse"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flow-canvas-footer">
              <span className="status-indicator live"></span>
              <span className="status-text">Workflow Listening on /api/submissions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
