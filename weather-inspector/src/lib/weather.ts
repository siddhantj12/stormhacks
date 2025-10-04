import { mapWeatherCodeToIcon } from '@/components/weather/IconWeather';

export interface NormalizedWeather {
  locationLabel: string;
  current: {
    tempC: number;
    windKph: number;
    humidityPct?: number;
    desc: string;
    code: number;
  };
  hourly: Array<{
    timeISO: string;
    tempC: number;
    precipProb?: number;
    code: number;
  }>;
}

export async function fetchOpenMeteo(lat: number, lon: number, label: string): Promise<NormalizedWeather> {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weathercode&current_weather=true&timezone=auto`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data from Open-Meteo.');
  }
  const data = await response.json();

  // Normalize the API response
  const { label: desc, icon } = mapWeatherCodeToIcon(data.current_weather.weathercode);

  const normalized: NormalizedWeather = {
    locationLabel: label,
    current: {
      tempC: data.current_weather.temperature,
      windKph: data.current_weather.windspeed,
      humidityPct: undefined, // Not in this API response, but showing structure
      desc,
      code: data.current_weather.weathercode,
    },
    hourly: data.hourly.time.map((t: string, index: number) => ({
      timeISO: t,
      tempC: data.hourly.temperature_2m[index],
      precipProb: data.hourly.precipitation_probability[index],
      code: data.hourly.weathercode[index],
    })),
  };

  return normalized;
}
