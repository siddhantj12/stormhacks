import axios from 'axios';

const API_KEY = '899ad44ba9f7a0d57685c68e4848c7f7';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  date: string;
  time: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  windSpeed: number;
  icon: string;
  condition: string;
}

export interface DailyForecast {
  day: string;
  temp: number;
  icon: string;
  condition: string;
}

const getWeatherIcon = (weatherCode: string, isDay: boolean = true): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '/113.svg',
    '01n': '/113.svg',
    '02d': '/partly-cloudy-day.png',
    '02n': '/partly-cloudy-day.png',
    '03d': '/cloud.png',
    '03n': '/cloud.png',
    '04d': '/cloud-1.png',
    '04n': '/cloud-1.png',
    '09d': '/blur.png',
    '09n': '/blur.png',
    '10d': '/392.svg',
    '10n': '/392.svg',
    '11d': '/thunderstorm.png',
    '11n': '/thunderstorm.png',
    '13d': '/weather-snowy.png',
    '13n': '/weather-snowy.png',
    '50d': '/117.svg',
    '50n': '/117.svg',
  };

  return iconMap[weatherCode] || '/cloud.png';
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

const getDayName = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getCurrentWeather = async (city: string = 'Vancouver'): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    const now = Date.now() / 1000;

    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      precipitation: data.rain?.['1h'] || 0,
      windSpeed: Math.round(data.wind.speed * 3.6),
      windDirection: data.wind.deg,
      uvIndex: 4,
      sunrise: formatTime(data.sys.sunrise),
      sunset: formatTime(data.sys.sunset),
      date: formatDate(now),
      time: formatTime(now)
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    const now = Date.now() / 1000;
    return {
      location: 'Vancouver',
      temperature: 21,
      condition: 'Cloudy',
      precipitation: 1.88,
      windSpeed: 13,
      windDirection: 180,
      uvIndex: 4,
      sunrise: '5:28 AM',
      sunset: '7:30 PM',
      date: formatDate(now),
      time: formatTime(now)
    };
  }
};

export const getHourlyForecast = async (city: string = 'Vancouver'): Promise<HourlyForecast[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    return response.data.list.slice(0, 12).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      temp: Math.round(item.main.temp),
      windSpeed: Math.round(item.wind.speed * 3.6),
      icon: getWeatherIcon(item.weather[0].icon),
      condition: item.weather[0].main
    }));
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    return [
      { time: "16:00", icon: "/117.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "17:00", icon: "/392.svg", windSpeed: 15, temp: 20, condition: "Rain" },
      { time: "18:00", icon: "/113.svg", windSpeed: 15, temp: 20, condition: "Clear" },
      { time: "19:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "20:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "21:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "22:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "23:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "00:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "01:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "02:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
      { time: "03:00", icon: "/390.svg", windSpeed: 15, temp: 20, condition: "Cloudy" },
    ];
  }
};

export const getDailyForecast = async (city: string = 'Vancouver'): Promise<DailyForecast[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const dailyData: { [key: string]: any } = {};

    response.data.list.forEach((item: any) => {
      const day = getDayName(item.dt);
      if (!dailyData[day]) {
        dailyData[day] = {
          day,
          temp: Math.round(item.main.temp),
          icon: getWeatherIcon(item.weather[0].icon),
          condition: item.weather[0].main
        };
      }
    });

    return Object.values(dailyData).slice(0, 6);
  } catch (error) {
    console.error('Error fetching daily forecast:', error);
    return [
      { day: "Sun", temp: 18, icon: "/cloud.png", condition: "Cloudy" },
      { day: "Mon", temp: 20, icon: "/partly-cloudy-day.png", condition: "Partly Cloudy" },
      { day: "Tue", temp: 18, icon: "/thunderstorm.png", condition: "Thunderstorm" },
      { day: "Wed", temp: 16, icon: "/weather-snowy.png", condition: "Snow" },
      { day: "Thu", temp: 20, icon: "/cloud-1.png", condition: "Cloudy" },
      { day: "Fri", temp: 15, icon: "/partly-cloudy-day-1.png", condition: "Partly Cloudy" },
    ];
  }
};
