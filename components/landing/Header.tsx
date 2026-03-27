"use client";
import React, { useState, useEffect } from 'react';
import AppLogo from './AppLogo';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Process', href: '#how-it-works' },
    { label: 'Outcomes', href: '#value' },
    { label: 'Login', href: '/login' },
  ];

  const headerBg = scrolled 
    ? 'rgba(4, 30, 22, 0.98)' 
    : 'transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div 
          className="flex items-center justify-between px-6 py-2.5 rounded-full transition-all duration-300" 
          style={{ 
            background: headerBg,
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            border: scrolled ? '1px solid rgba(212,160,23,0.3)' : '1px solid transparent'
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <AppLogo text="AgriForecast" size={24} className="text-mist" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="nav-link font-mono uppercase tracking-widest transition-colors"
                style={{ fontSize: '0.65rem', letterSpacing: '0.18em' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            {/* Global CTA - Always visible but smaller on mobile */}
            <a 
              href="/login" 
              className="btn-gold flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 text-[0.6rem] md:text-[0.65rem] rounded-sm uppercase tracking-widest font-bold shadow-2xl"
            >
              <span>Get Started</span>
            </a>

            {/* Mobile hamburger */}
            <button className="lg:hidden flex flex-col gap-1.5 p-2 bg-[var(--color-primary-800)]/40 rounded-lg border border-gold/20" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="w-5 h-px bg-gold transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <div className="w-5 h-px bg-gold transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
              <div className="w-5 h-px bg-gold transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu - Animated slide down */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
        >
          <div className="glass-dark p-8 flex flex-col gap-5 rounded-2xl border border-gold/30 shadow-2xl">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="font-mono text-xs uppercase tracking-widest text-mist py-2 hover:text-gold transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a 
              href="/login" 
              className="btn-gold px-7 py-4 text-[0.7rem] text-center rounded-sm mt-2 font-bold uppercase tracking-widest shadow-xl" 
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;