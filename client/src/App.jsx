import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Benefits from './components/Benefits';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import LeadForm from './components/LeadForm';
import Footer from './components/Footer';

export default function App() {
  const [highlightForm, setHighlightForm] = useState(false);

  const triggerFormHighlight = () => {
    setHighlightForm(true);
    // Automatically turn off highlight class after animation finishes
    setTimeout(() => {
      setHighlightForm(false);
    }, 2000);
  };

  return (
    <div className="app-layout">
      <Navbar onCtaClick={triggerFormHighlight} />
      <Hero onCtaClick={triggerFormHighlight} />
      <Features />
      <Benefits />
      <Pricing />
      <Testimonials />
      <Faq />
      <LeadForm isHighlighted={highlightForm} />
      <Footer />
    </div>
  );
}
