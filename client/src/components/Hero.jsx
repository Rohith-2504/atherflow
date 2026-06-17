import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import './Hero.css';
import Workflow3D from './Workflow3D';

export default function Hero({ onCtaClick }) {
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

        <div className="hero-visual animate-float">
          <Workflow3D />
        </div>
      </div>
    </section>
  );
}
