import React, { useState } from 'react';
import { Check, Code, Zap, ShieldAlert } from 'lucide-react';
import './Benefits.css';

export default function Benefits() {
  const [activeTab, setActiveTab] = useState('aether');

  const legacyCode = `// 🚫 Legacy Hand-Coded Form Handling
app.post('/lead', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  // Brittle validation
  if(!email.includes('@')) {
    return res.send("Invalid Email");
  }
  // SQL Injection Vulnerability!
  const query = "INSERT INTO leads VALUES('" + name + "', '" + email + "')";
  db.query(query, (err, result) => {
    if(err) throw err;
    res.send("Success");
  });
});`;

  const aetherCode = `//  AetherFlow Clean Architecture
const stmt = db.prepare(\`
  INSERT INTO submissions (full_name, mobile_number, email, city, message)
  VALUES (?, ?, ?, ?, ?)
\`);

// Structured binding + regex sanitization
const result = stmt.run(name, mobile, email, city, message);
res.status(201).json({ success: true, id: result.lastInsertRowid });`;

  return (
    <section id="benefits" className="benefits-section section">
      <div className="container benefits-grid">
        <div className="benefits-content">
          <span className="tagline">Benefits</span>
          <h2>The Smarter Way to Ingest Leads</h2>
          <p className="benefits-lead-text">
            Stop writing boilerplate handlers and risky SQL statements. AetherFlow secures your server endpoints and optimizes lead classification.
          </p>

          <div className="benefit-items">
            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>70% Reduction in API Code</h4>
                <p>Auto-generate validated endpoints matching database schema attributes with no redundant routing logic.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Bulletproof Security Controls</h4>
                <p>Prevent database exploitation. Structured variables are bound automatically to block query attacks and script injection.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Auto-Categorized Leads</h4>
                <p>AI extracts core details from message text (budget, timezone, urgent questions) and adds labels on database write.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="benefits-visual">
          <div className="code-card glassmorphic-panel">
            <div className="code-card-tabs">
              <button 
                className={`code-tab-btn legacy ${activeTab === 'legacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('legacy')}
              >
                <ShieldAlert size={14} /> Legacy Code
              </button>
              <button 
                className={`code-tab-btn aether ${activeTab === 'aether' ? 'active' : ''}`}
                onClick={() => setActiveTab('aether')}
              >
                <Code size={14} /> AetherFlow
              </button>
            </div>
            <div className="code-body">
              <pre>
                <code>
                  {activeTab === 'legacy' ? legacyCode : aetherCode}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
