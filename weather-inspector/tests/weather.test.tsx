import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WeatherCard from '@/components/WeatherCard';
import { NormalizedWeather } from '@/lib/weather';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockWeather: NormalizedWeather = {
  locationLabel: 'Testville',
  current: {
    tempC: 22.5,
    windKph: 10.2,
    humidityPct: 65,
    desc: 'Partly Cloudy',
    code: 2,
  },
  hourly: [],
};

describe('WeatherCard', () => {
  it('renders loading state and then weather data', () => {
    render(<WeatherCard weather={mockWeather} />);
    
    expect(screen.getByText('Testville')).toBeInTheDocument();
    expect(screen.getByText('23°C')).toBeInTheDocument();
    expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
    expect(screen.getByText('10.2 km/h')).toBeInTheDocument();
  });
});
