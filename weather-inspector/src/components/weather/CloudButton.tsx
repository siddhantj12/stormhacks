'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useThemeMode } from '@/lib/theme'

export default function CloudButton(){
  const router = useRouter()
  const { setRainActive, setMode } = useThemeMode()

  async function onTap(){
    setRainActive(true)               // show rain overlay
    // optional: play thunder sfx here
    await new Promise(r => setTimeout(r, 2200)) // <= keep snappy
    setMode('noir')                   // swap theme to noir
    setRainActive(false)              // stop rain
    router.push('/game/case-001/scene/theatre')
  }

  return (
    <button aria-label="Cloud" onClick={onTap} className="h-28 w-28 rounded-full">{/* cloud svg */}</button>
  )
}