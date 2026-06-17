import React, { useState } from 'react';
import { Layers, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#" className="footer-logo" onClick={handleLogoClick}>
            <Layers className="logo-icon" size={24} />
            <span>AetherFlow</span>
          </a>
          <p className="footer-brand-desc">
            Automating secure developer pipelines and form captures using structured local database bindings.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-column">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#benefits">Benefits</a>
          <a href="#pricing">Pricing Plans</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="footer-links-column">
          <h4>Resources</h4>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">API Reference</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="#lead-form">SQLite Sandbox</a>
          <a href="#faq">System Status</a>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to receive system features, security patches, and release notes.</p>
          {subscribed ? (
            <div className="newsletter-success">
              <Sparkles size={14} />
              <span>Subscribed successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="btn btn-primary">Join</button>
            </form>
          )}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} AetherFlow Technology Inc. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#faq">Privacy Policy</a>
          <a href="#faq">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
