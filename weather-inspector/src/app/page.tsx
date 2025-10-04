'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCoordsWithFallback, Coords } from '@/lib/geolocate';
import { fetchOpenMeteo, NormalizedWeather } from '@/lib/weather';
import WeatherCard from '@/components/weather/WeatherCard'; // Updated path
import HourlyStrip from '@/components/weather/HourlyStrip'; // Updated path
import CloudButton from '@/components/weather/CloudButton'; // Updated path
import RainOverlay from '@/components/weather/RainOverlay'; // Updated path
import { useThemeMode } from '@/lib/theme'; // Import useThemeMode

type Status = 'loading' | 'success' | 'error' | 'denied';

export default function WeatherPage() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [weather, setWeather] = useState<NormalizedWeather | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const router = useRouter();
  const { setMode } = useThemeMode(); // Use setMode from global provider

  useEffect(() => {
    // Reset theme to weather when navigating to this page
    setMode('weather');
  }, [setMode]);

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
      <RainOverlay /> {/* No active prop needed */}
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex flex-col">
        <div className="w-full max-w-md mx-auto space-y-6">
          {renderContent()}
          <div className="flex justify-center items-center pt-8">
            <CloudButton /> {/* No onActivate or disabled prop needed */}
          </div>
        </div>
      </div>
       {/* Removed audio toggle as per new CloudButton logic */}
    </main>
  );
}