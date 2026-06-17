import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Faq.css';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: 'How does the SQLite database handle concurrent requests?',
      a: 'AetherFlow utilizes better-sqlite3 in synchronous mode. Because Node.js runs Express in a single-threaded event loop, SQL transactions execute in a rapid sequential stack. This prevents file locking conflicts and achieves high throughput.'
    },
    {
      q: 'What kind of validations are executed on form submission?',
      a: 'We implement double-layer validation. First, the React frontend checks format patterns (such as standard emails and 7-to-15 digit phone numbers) in real-time. Second, the Express API re-validates and sanitizes all inputs to ensure bad requests or script injections are blocked before reaching SQLite.'
    },
    {
      q: 'Can I extract or view the data stored in the database?',
      a: 'Yes. The database is saved locally as submissions.db under server/data/. You can query this file using any SQL viewer like DB Browser for SQLite, or fetch all leads using the secure, built-in admin table at the bottom of our web portal.'
    },
    {
      q: 'Is this architecture compatible with cloud databases like PostgreSQL?',
      a: 'Absolutely. The SQL queries use standard, compliant syntax. You can easily swap better-sqlite3 for pg or mysql2 in server/db.js without rewriting any of the frontend UI or validation schemas.'
    },
    {
      q: 'How is this monorepo prepared for single-host deployment?',
      a: 'We compile the React app into client/dist/ and instruct our Express backend to serve it as static files. This packages the frontend client and backend API into a single, unified Node.js service that runs on Render, Railway, or a VPS.'
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section section">
      <div className="container faq-container">
        <div className="section-header">
          <span className="tagline">Got Questions?</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about the stack, validation rules, database integrity, and production hosting.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item glassmorphic-panel ${activeIndex === idx ? 'open' : ''}`}
              onClick={() => toggleAccordion(idx)}
            >
              <button className="faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              <div className="faq-answer-wrapper">
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
