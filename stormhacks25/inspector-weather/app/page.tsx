'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCoordsWithFallback, Coords } from '@/lib/geolocate';
import { fetchOpenMeteo, NormalizedWeather } from '@/lib/weather';
import WeatherCard from '@/components/WeatherCard';
import HourlyStrip from '@/components/HourlyStrip';
import CloudButton from '@/components/CloudButton';
import RainOverlay from '@/components/RainOverlay';

type Status = 'loading' | 'success' | 'error' | 'denied';

export default function WeatherPage() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [weather, setWeather] = useState<NormalizedWeather | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [isAnimating, setIsAnimating] = useState(false);
  const [playAudio, setPlayAudio] = useState(true);
  const router = useRouter();

  const audio = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new Audio('/sounds/thunder.mp3');
    }
    return null;
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const userCoords = await getCoordsWithFallback();
        setCoords(userCoords);
        if (userCoords.source === 'fallback') {
          setStatus('denied'); // Or just a different status to show the banner
        }
        const weatherData = await fetchOpenMeteo(userCoords.lat, userCoords.lon, userCoords.label);
        setWeather(weatherData);
        if (status !== 'denied') setStatus('success');
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setStatus('error');
      }
    };

    fetchWeather();
  }, [status]);

  const handleCloudActivation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (playAudio && audio) {
      audio.play().catch(console.error);
    }

    setTimeout(() => {
      router.push('/case');
    }, 2500); // Match animation duration
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <div className="text-center">Loading weather...</div>;
      case 'error':
        return (
          <div className="text-center">
            <p>Failed to fetch weather data.</p>
            <button onClick={() => setStatus('loading')} className="mt-2 px-4 py-2 bg-weather-accent rounded-md">
              Retry
            </button>
          </div>
        );
      case 'success':
      case 'denied':
        if (!weather) return null;
        return (
          <>
            {status === 'denied' && (
              <div className="text-center bg-yellow-100 text-yellow-800 p-2 rounded-md mb-4">
                Using fallback location (Vancouver, BC) due to location permissions.
              </div>
            )}
            <WeatherCard weather={weather} />
            <HourlyStrip hourly={weather.hourly} />
          </>
        );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-24 bg-weather-bg font-sans">
      <RainOverlay active={isAnimating} />
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex flex-col">
        <div className="w-full max-w-md mx-auto space-y-6">
          {renderContent()}
          <div className="flex justify-center items-center pt-8">
            <CloudButton onActivate={handleCloudActivation} disabled={isAnimating} />
          </div>
        </div>
      </div>
       <div className="absolute bottom-4 right-4 z-20">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={playAudio} onChange={() => setPlayAudio(!playAudio)} className="h-4 w-4 rounded" />
            <span className="text-xs text-gray-600">Sound ON</span>
          </label>
        </div>
    </main>
  );
}
