
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after a small delay
    setTimeout(() => {
      setAnimate(true);
    }, 300);
    
    // Navigate away after animation completes
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (hasSeenOnboarding) {
        navigate('/login');
      } else {
        navigate('/onboarding');
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-masar-cream">
      <div className={`transition-all duration-1000 ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-64 h-96 bg-masar-gold rounded-lg shadow-xl border-2 border-masar-gold/50 flex flex-col items-center justify-center p-6">
          <img 
            src="/lovable-uploads/21b85797-a307-41e9-bf45-70a8191c7f5c.png" 
            alt="Masar Logo" 
            className="w-40 h-auto mb-8"
          />
          <div className="text-center">
            <h1 className="text-white font-bold text-xl">MASAR</h1>
            <p className="text-white/80 text-sm mt-2">UAE Digital Passport</p>
          </div>
        </div>
      </div>
      <div className={`mt-8 transition-all duration-1000 delay-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h1 className="text-xl font-bold text-masar-teal">Your Emirates Adventure Begins</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
