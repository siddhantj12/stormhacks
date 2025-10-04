'use client';

import { useReducer, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useReducedMotion } from 'framer-motion';

// To use a Lottie animation, you must first add a valid Lottie JSON file
// to `/public/lottie/cloud-rain.json`. Then, uncomment the following lines
// and set `useLottie` to `true` below.

// import * as cloudRainAnimation from '@/public/lottie/cloud-rain.json';
const lottieAnimationData: any = null; // or `cloudRainAnimation` if imported

interface RainOverlayProps {
  active: boolean;
}

// --- CSS Rain Implementation ---
const Raindrop = ({ id }: { id: number }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${0.5 + Math.random() * 0.5}s`,
  };
  return (
    <div
      key={id}
      className="absolute top-0 w-0.5 h-12 bg-gradient-to-b from-transparent to-weather-accent animate-rain"
      style={style}
    ></div>
  );
};

const CSSRain = () => {
  const drops = Array.from({ length: 100 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {drops.map(id => <Raindrop key={id} id={id} />)}
    </div>
  );
};

// --- Component ---
export default function RainOverlay({ active }: RainOverlayProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isRendered, unmount] = useReducer(() => false, true);

  // Set this to true if you have a lottie file at public/lottie/cloud-rain.json
  const useLottie = false; 

  useEffect(() => {
    if (!active) {
      // Give fade-out animation time to complete before unmounting
      const timer = setTimeout(() => unmount(), 500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active && !isRendered) {
    return null;
  }

  const animationClass = active ? 'opacity-100' : 'opacity-0';
  const motionSafeClass = shouldReduceMotion ? 'bg-black/30' : '';

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${animationClass} ${motionSafeClass}`}
      aria-hidden="true"
    >
      {!shouldReduceMotion && (
        <>
          {useLottie && lottieAnimationData ? (
            <Lottie animationData={lottieAnimationData} loop={false} />
          ) : (
            <CSSRain />
          )}
        </>
      )}
    </div>
  );
}
