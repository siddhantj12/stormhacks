import { NormalizedWeather } from '@/lib/weather';
import IconWeather from './IconWeather';

interface WeatherCardProps {
  weather: NormalizedWeather;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { locationLabel, current } = weather;
  const feelsLike = current.tempC; // Simplified for this example
  const humidity = current.humidityPct ?? 'N/A';
  const wind = `${current.windKph.toFixed(1)} km/h`;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 text-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{locationLabel}</h2>
          <p className="text-5xl font-light mt-2">{Math.round(current.tempC)}°C</p>
          <p className="text-lg capitalize">{current.desc}</p>
        </div>
        <div className="text-6xl">
          <IconWeather code={current.code} />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-300 flex justify-around text-center">
        <div>
          <p className="text-sm text-gray-600">Feels Like</p>
          <p className="font-semibold">{Math.round(feelsLike)}°</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Humidity</p>
          <p className="font-semibold">{humidity}{typeof humidity === 'number' ? '%' : ''}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Wind</p>
          <p className="font-semibold">{wind}</p>
        </div>
      </div>
    </div>
  );
}
