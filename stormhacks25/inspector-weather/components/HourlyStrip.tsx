import IconWeather from './IconWeather';
import { NormalizedWeather } from '@/lib/weather';

interface HourlyStripProps {
  hourly: NormalizedWeather['hourly'];
}

export default function HourlyStrip({ hourly }: HourlyStripProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Hourly Forecast</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory' }}>
        {hourly.slice(0, 12).map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-24 text-center bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow"
            style={{ scrollSnapAlign: 'start' }}
          >
            <p className="font-semibold text-sm">
              {new Date(hour.timeISO).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
            </p>
            <div className="text-3xl my-2">
              <IconWeather code={hour.code} />
            </div>
            <p className="font-bold">{Math.round(hour.tempC)}°C</p>
            {hour.precipProb !== undefined && (
              <p className="text-xs text-blue-500 mt-1">{hour.precipProb}%</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
