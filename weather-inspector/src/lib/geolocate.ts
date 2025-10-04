export interface Coords {
  lat: number;
  lon: number;
  source: 'geo' | 'fallback';
  label: string;
}

const FALLBACK_COORDS: Coords = {
  lat: 49.2827,
  lon: -123.1207,
  label: "Vancouver, BC",
  source: 'fallback',
};

export const getCoordsWithFallback = (timeoutMs: number = 4000): Promise<Coords> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      return resolve(FALLBACK_COORDS);
    }

    const timer = setTimeout(() => {
      resolve(FALLBACK_COORDS);
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          source: 'geo',
          label: 'Your Location',
        });
      },
      (error) => {
        clearTimeout(timer);
        console.warn(`Geolocation error (${error.code}): ${error.message}`);
        resolve(FALLBACK_COORDS);
      },
      {
        enableHighAccuracy: false,
        timeout: timeoutMs,
        maximumAge: 1000 * 60 * 30, // 30 minutes
      }
    );
  });
};
