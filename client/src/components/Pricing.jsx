import React from 'react';
import { Check, HelpCircle } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const tiers = [
    {
      name: 'Developer',
      price: '$0',
      period: 'forever',
      desc: 'Perfect for local development and personal staging environments.',
      features: [
        '1 Local SQLite Database',
        'Up to 100 Lead Submissions/mo',
        'Standard Client Validation',
        'Community Forum Access'
      ],
      cta: 'Start Building',
      popular: false
    },
    {
      name: 'Growth',
      price: '$49',
      period: 'per month',
      desc: 'Designed for production websites requiring secure validation & automated AI.',
      features: [
        'Unlimited SQLite Instances',
        'Up to 5,000 Submissions/mo',
        'Double-Layer Regex Validation',
        'AI Intent & Sentiment Classifier',
        'Slack & Email Auto-Alerts',
        'Priority Email Support (12h SLA)'
      ],
      cta: 'Get Started Now',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored SLA',
      desc: 'For high-volume web portals and complex pipeline orchestration.',
      features: [
        'Dedicated SQLite Cluster/Sync',
        'Unlimited Monthly Submissions',
        'Custom AI Agent Fine-Tuning',
        'Dedicated Technical Account Manager',
        'SSO/SAML Secure Gateway Integration',
        '24/7 Telephone & Zoom SLA Support'
      ],
      cta: 'Contact Enterprise',
      popular: false
    }
  ];

  const handleCTAClick = (e) => {
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
    }
  };

  return (
    <section id="pricing" className="pricing-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Flexible Tiers</span>
          <h2>Plans That Scale With You</h2>
          <p>Start local for free, then upgrade to full security automation when you launch to real traffic.</p>
        </div>

        <div className="pricing-grid">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`pricing-card ${tier.popular ? 'popular glassmorphic-panel' : 'glassmorphic-panel'}`}>
              {tier.popular && <span className="popular-badge">Most Popular</span>}
              <div className="tier-header">
                <h3>{tier.name}</h3>
                <p className="tier-desc">{tier.desc}</p>
                <div className="price-container">
                  <span className="price-value">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="price-period">/{tier.period}</span>}
                </div>
              </div>

              <div className="tier-divider"></div>

              <ul className="tier-features">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <Check size={16} className="feature-check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="#lead-form" 
                onClick={handleCTAClick}
                className={`btn pricing-cta ${tier.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
