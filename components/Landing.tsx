
import React from 'react';
import Awareness from './Awareness';

interface LandingProps {
  onStart: () => void;
  hasAccount: boolean;
  onNewAccount: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart, hasAccount, onNewAccount }) => {
  return (
    <div className="bg-luxury min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-full h-full border-[1px] border-gold rounded-full transform scale-150"></div>
        </div>

        <div className="text-center z-10 animate-fade-in">
          <div className="relative mb-8 flex flex-col items-center">
            <div className="text-[12rem] md:text-[18rem] font-serif leading-none text-gold opacity-80 select-none drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              S
            </div>
            <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl md:text-5xl font-serif tracking-[0.4em] text-gold whitespace-nowrap bg-luxury px-6 py-2 border-y border-gold/20">
              SCENTHOOD
            </h1>
          </div>
          
          <p className="font-script text-xl md:text-4xl text-gold mb-16 tracking-wide drop-shadow-md">
            Find your perfect perfume
          </p>

          <div className="flex flex-col gap-6 items-center">
            <button 
              onClick={onStart}
              className="group relative px-20 py-5 overflow-hidden border border-gold text-gold transition-all duration-500 hover:text-black tracking-[0.3em] uppercase text-xs font-bold"
            >
              <span className="relative z-10">
                {hasAccount ? "Welcome Back" : "Enter the Atelier"}
              </span>
              <div className="absolute inset-0 bg-gold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>

            {hasAccount && (
              <button 
                onClick={onNewAccount}
                className="text-[10px] tracking-[0.4em] uppercase text-white hover:text-gold transition-colors mt-4 border-b border-transparent hover:border-gold"
              >
                Or create a new account
              </button>
            )}

            <a 
              href="#awareness"
              className="mt-12 text-[9px] tracking-[0.4em] uppercase text-white/40 hover:text-gold transition-all animate-bounce"
            >
              Discover the art of scent ↓
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 text-[10px] tracking-[0.5em] text-white uppercase flex items-center gap-4">
          <span>Established MMXXVI</span>
          <span className="text-gold/50">|</span>
          <span>Pure Olfactory Bliss</span>
        </div>
      </div>

      {/* Awareness Section */}
      <Awareness />

      {/* Footer Branding */}
      <footer className="py-12 px-8 text-center bg-black/50 border-t border-white/5">
        <p className="text-[10px] tracking-[0.6em] uppercase text-gold/50 mb-4">SCENTHOOD LUXURY FRAGRANCE GROUP</p>
        <p className="text-[8px] tracking-[0.4em] uppercase text-white/20">All Rights Reserved &copy; 2026</p>
      </footer>
    </div>
  );
};

export default Landing;
