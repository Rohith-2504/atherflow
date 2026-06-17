import React from 'react';
import { Cpu, Database, Layers, Zap, ShieldCheck, BarChart3 } from 'lucide-react';
import './Features.css';

export default function Features() {
  const features = [
    {
      icon: <Cpu size={24} />,
      title: 'AI-Powered Parsing',
      desc: 'Ingest contact message inputs and automatically classify customer intent, sentiment, or product interest categories.'
    },
    {
      icon: <Database size={24} />,
      title: 'SQLite Core Engine',
      desc: 'All form submissions write instantly to a lightweight, blazing-fast SQLite instance managed via better-sqlite3.'
    },
    {
      icon: <Layers size={24} />,
      title: 'Visual Node Orchestrator',
      desc: 'Map form triggers, conditional routers, third-party hooks, and databases in a unified, visual canvas.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Microsecond Execution',
      desc: 'Engineered on an optimized Express and SQLite stack for sub-40ms client-to-database form submission cycles.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Double-Layer Validation',
      desc: 'Client-side verification secures the UI, while regex-matched server-side scripts isolate backend databases.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Live Ingestion Dashboard',
      desc: 'Monitor submission counts, city distributions, and message statistics in a responsive administrator view.'
    }
  ];

  return (
    <section id="features" className="features-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Capabilities</span>
          <h2>Engineered for Modern Teams</h2>
          <p>Deploy a lightweight lead capture environment designed to run seamlessly in the cloud or on local hardware.</p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="feature-card glassmorphic-panel">
              <div className="feature-icon-box">
                {feat.icon}
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
