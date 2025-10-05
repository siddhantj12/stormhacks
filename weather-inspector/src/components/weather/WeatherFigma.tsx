'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useArtboardScale } from './useArtboardScale'
import { useThemeMode } from '@/lib/theme'
import LiveOverlay from './LiveOverlay'
import FigmaUnderlay from './FigmaUnderlay' // NEW: Import FigmaUnderlay
import '@/styles/weather-figma.css'

export default function WeatherFigma() {
  const { containerStyle, artboardStyle } = useArtboardScale(1512, 982)
  const router = useRouter()
  const { setRainActive, setMode } = useThemeMode()

  useEffect(() => { setMode('weather') }, [setMode])

  async function handleCloudTap() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setRainActive(true)
    await new Promise(r => setTimeout(r, reduce ? 200 : 2200))
    setMode('noir'); setRainActive(false)
    router.push('/game/case-001/scene/theatre')
  }

  return (
    <main style={containerStyle} className="bg-skyBg text-skyText">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-300 to-white" aria-hidden />
      <div className="figma-weather relative" style={artboardStyle}>
        {/* 1) Paint the major shapes so text is visible */}
        <FigmaUnderlay /> {/* NEW: Mount FigmaUnderlay */}

        {/* 2) Cloud hotspots */}
        <button className="figma-cloud cloud-1" aria-label="Open case" onClick={handleCloudTap} />
        <button className="figma-cloud cloud-2" aria-label="Open case" onClick={handleCloudTap} />

        {/* 3) Live data text */}
        <LiveOverlay />
      </div>
    </main>
  )
}
