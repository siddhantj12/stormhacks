'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CloudButtonProps {
  onActivate: () => void;
  disabled?: boolean;
}

export default function CloudButton({ onActivate, disabled }: CloudButtonProps) {
  const [isRippling, setIsRippling] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsRippling(true);
    onActivate();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      aria-label="Secret cloud — tap to toggle the weather"
      className="relative flex items-center justify-center w-48 h-32 bg-white rounded-full shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-weather-accent disabled:opacity-50"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Cloud shape */}
      <div className="absolute w-24 h-24 bg-white rounded-full -top-8 left-10"></div>
      <div className="absolute w-20 h-20 bg-white rounded-full -top-4 right-12"></div>
      <div className="absolute w-32 h-32 bg-white rounded-full top-0 left-16"></div>
      
      {isRippling && (
        <div 
          className="absolute w-full h-full rounded-full animate-ripple bg-weather-accent"
          onAnimationEnd={() => setIsRippling(false)}
        />
      )}
      
      <span className="relative z-10 text-gray-500 text-sm">???</span>
    </motion.button>
  );
}
