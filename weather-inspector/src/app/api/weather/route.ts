import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat') ?? 49.2827)
  const lon = Number(searchParams.get('lon') ?? -123.1207)

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,weather_code,uv_index` +
    `&hourly=precipitation,precipitation_probability,uv_index` +
    `&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,weather_code` +
    `&timezone=auto`

  const res = await fetch(url, { next: { revalidate: 600 } }) // cache 10 min
  const data = await res.json()
  return NextResponse.json(data)
}
