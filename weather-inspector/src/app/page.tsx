'use client';

import { useEffect } from 'react';
import RainOverlay from '@/components/weather/RainOverlay';
import { useThemeMode } from '@/lib/theme';
import WeatherFigma from '@/components/weather/WeatherFigma'; // Import WeatherFigma

export default function WeatherPage() {
  const { setMode } = useThemeMode();

  useEffect(() => {
    // Reset theme to weather when navigating to this page
    setMode('weather');
  }, [setMode]);

  return (
    <>
      <WeatherFigma />
      <RainOverlay />
    </>
  );
}
