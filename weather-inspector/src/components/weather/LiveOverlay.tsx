'use client'
import { useWeather } from './useWeather'

function dirToCompass(deg:number) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW','N']; return dirs[Math.round(deg/45)]
}
function uvLabel(u:number) {
  if (u < 3) return 'Low'; if (u < 6) return 'Moderate'; if (u < 8) return 'High'
  if (u < 11) return 'Very High'; return 'Extreme'
}
function sumNextHours(series:number[], nowIndex:number, hours=3) {
  return series.slice(nowIndex+1, nowIndex+1+hours).reduce((a,b)=>a+(b??0),0)
}

export default function LiveOverlay() {
  const { data, loc } = useWeather()
  if (!data) return null

  const nowIso = data.current.time as string
  const idx = data.hourly.time.indexOf(nowIso)
  const lastHour = Math.max(0, idx - 1)
  const precipLastHour = data.hourly.precipitation[lastHour] ?? 0
  const precipNext3h = sumNextHours(data.hourly.precipitation, idx, 3)

  const t = Math.round(data.current.temperature_2m)
  const wind = Math.round(data.current.wind_speed_10m)
  const windDir = dirToCompass(data.current.wind_direction_10m)
  const uvNow = Math.round(data.current.uv_index ?? data.daily.uv_index_max[0])
  const sunrise = new Date(data.daily.sunrise[0]).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})
  const sunset  = new Date(data.daily.sunset[0]).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})
  const today = new Date(nowIso).toLocaleDateString([], { weekday:'long', day:'numeric', month:'short', year:'numeric' })
  const timeNow = new Date(nowIso).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})

  const days = data.daily.time.slice(0,6).map((d:string, i:number)=>({
    label: new Date(d).toLocaleDateString([], { weekday:'short' }),
    tmax: Math.round(data.daily.temperature_2m_max[i])
  }))

  return (
    <>
      {/* Big temp */}
      <div className="abs" style={{ left:77, top:306 }}>
        <span style={{ fontSize:128, color:'#fff', lineHeight:'106px', fontWeight:500 }}>{t}°</span>
      </div>

      {/* Location/date/time (left card) */}
      <div className="abs" style={{ left:92, top:540, color:'#fff' }}>{loc.name}</div>
      <div className="abs" style={{ left:92, top:609, color:'#fff' }}>{today}</div>
      <div className="abs" style={{ left:92, top:636, color:'#fff' }}>{timeNow}</div>

      {/* Precipitation card */}
      <div className="abs" style={{ left:268, top:525, color:'#fff' }}>
        {precipLastHour.toFixed(2)}mm in last hour
      </div>
      <div className="abs" style={{ left:268, top:609, color:'#fff' }}>
        {precipNext3h.toFixed(1)}mm expected next 3h
      </div>

      {/* Wind card */}
      <div className="abs" style={{ left:441, top:517, color:'#fff' }}>
        <strong style={{ fontSize:24 }}>{wind} km/h</strong> &nbsp; {windDir}
      </div>

      {/* UV / Sunrise card */}
      <div className="abs" style={{ left:619, top:525, color:'#fff' }}>
        {uvNow} {uvLabel(uvNow)}
      </div>
      <div className="abs" style={{ left:796, top:526, color:'#fff' }}>{sunrise}</div>
      <div className="abs" style={{ left:796, top:621, color:'#fff' }}>Sunset {sunset}</div>

      {/* 6-day strip */}
      {days.map((d, i) => (
        <div key={i} className="abs" style={{ left:133 + i*145, top:797, color:'#fff' }}>
          <div style={{ fontSize:50 }}>{d.tmax}</div>
          <div style={{ marginTop:6, fontSize:24, textAlign:'center' }}>{d.label}</div>
        </div>
      ))}
    </>
  )
}
