import React, { useState, useEffect } from 'react';
import { Menu, X, Layers } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onCtaClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of the navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (id === 'lead-form' && onCtaClick) {
        onCtaClick();
      }
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="nav-logo" onClick={(e) => handleNavClick(e, 'hero')}>
          <Layers className="logo-icon" size={24} />
          <span>AetherFlow</span>
        </a>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
          <a href="#benefits" onClick={(e) => handleNavClick(e, 'benefits')}>Benefits</a>
          <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')}>Pricing</a>
          <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')}>Reviews</a>
          <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')}>FAQ</a>
          <a 
            href="#lead-form" 
            className="btn btn-primary nav-cta" 
            onClick={(e) => handleNavClick(e, 'lead-form')}
          >
            Get Started
          </a>
        </div>

        <button className="nav-hamburger" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
