'use client'
import { useEffect, useState } from 'react'
export type WeatherData = any

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loc, setLoc] = useState<{lat:number; lon:number; name:string}>({
    lat: 49.2827, lon: -123.1207, name: 'Vancouver'
  })

  useEffect(() => {
    const load = (lat:number, lon:number, name:string) => {
      setLoc({ lat, lon, name })
      fetch(`/api/weather?lat=${lat}&lon=${lon}`).then(r => r.json()).then(setData)
    }
    const onError = () => load(49.2827, -123.1207, 'Vancouver')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => load(+p.coords.latitude.toFixed(4), +p.coords.longitude.toFixed(4), 'Your location'),
        onError,
        { timeout: 3000 }
      )
    } else onError()
  }, [])

  return { data, loc }
}
