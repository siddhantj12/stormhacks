// A simple component to map weather codes to emoji icons
// In a real app, you'd use an icon library like react-icons

interface IconWeatherProps {
  code: number;
  className?: string;
}

export default function IconWeather({ code, className }: IconWeatherProps) {
  const { icon } = mapWeatherCodeToIcon(code);
  return <span className={className} role="img">{icon}</span>;
}

export function mapWeatherCodeToIcon(code: number): { label: string; icon: string } {
    if ([0, 1].includes(code)) return { label: 'Clear', icon: '☀️' };
    if ([2].includes(code)) return { label: 'Partly Cloudy', icon: '⛅️' };
    if ([3].includes(code)) return { label: 'Cloudy', icon: '☁️' };
    if ([45, 48].includes(code)) return { label: 'Fog', icon: '🌫️' };
    if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: '💧' };
    if ([61, 63, 65, 66, 67].includes(code)) return { label: 'Rain', icon: '🌧️' };
    if ([71, 73, 75, 77].includes(code)) return { label: 'Snow', icon: '❄️' };
    if ([80, 81, 82].includes(code)) return { label: 'Rain Showers', icon: '🌦️' };
    if ([85, 86].includes(code)) return { label: 'Snow Showers', icon: '🌨️' };
    if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: '⛈️' };
    return { label: 'Cloudy', icon: '☁️' }; // Default
}
