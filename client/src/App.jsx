import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Benefits from './components/Benefits';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import LeadForm from './components/LeadForm';
import Footer from './components/Footer';
import Preloader from './components/Preloader';

export default function App() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);

  useEffect(() => {
    // Start fading out the preloader after 2.5s
    const fadeTimeout = setTimeout(() => {
      setFadeLoader(true);
    }, 2500);

    // Fully unmount the preloader from DOM after transition completes (3.1s)
    const unmountTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 3100);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(unmountTimeout);
    };
  }, []);

  const triggerFormHighlight = () => {
    setHighlightForm(true);
    // Automatically turn off highlight class after animation finishes
    setTimeout(() => {
      setHighlightForm(false);
    }, 2000);
  };

  return (
    <>
      {showLoader && <Preloader fade={fadeLoader} />}
      
      <div className={`app-layout-wrapper ${fadeLoader ? 'loaded' : ''}`}>
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
      </div>
    </>
  );
}
