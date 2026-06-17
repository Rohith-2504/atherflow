import React from 'react';
import { Star } from 'lucide-react';
import './Testimonials.css';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Lead Architect at CloudScale',
      text: 'AetherFlow completely simplified how we capture and sanitize lead streams. Setting up Express validation took minutes, and SQLite database writes are consistently sub-40ms.',
      stars: 5,
      initials: 'SJ',
      gradient: 'linear-gradient(135deg, #7c3aed, #06b6d4)'
    },
    {
      name: 'Michael Chen',
      role: 'Founder of DevLaunch',
      text: "Running SQLite via better-sqlite3 with AetherFlow's isolated transactions has resolved our lead ingestion database bottlenecks. It handles high traffic without a hiccup.",
      stars: 5,
      initials: 'MC',
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
    },
    {
      name: 'Elena Rostova',
      role: 'Growth Director at SaaSify',
      text: 'The double-layer email and phone validation blocked all bot signups overnight. Plus, our growth team can check live entries straight from the ingestion panel.',
      stars: 5,
      initials: 'ER',
      gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)'
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Success Stories</span>
          <h2>Loved by Developers & Marketers</h2>
          <p>Read how fast-growing startups leverage AetherFlow to secure and streamline their data ingestion pipelines.</p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card glassmorphic-panel">
              <div className="stars-row">
                {[...Array(rev.stars)].map((_, sIdx) => (
                  <Star key={sIdx} size={16} fill="var(--color-secondary)" color="var(--color-secondary)" />
                ))}
              </div>
              <p className="testimonial-text">"{rev.text}"</p>
              <div className="user-profile">
                <div className="profile-avatar" style={{ background: rev.gradient }}>
                  {rev.initials}
                </div>
                <div className="user-details">
                  <h4>{rev.name}</h4>
                  <p>{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
