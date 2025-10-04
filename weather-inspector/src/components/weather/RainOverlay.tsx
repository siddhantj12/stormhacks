'use client'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useThemeMode } from '@/lib/theme'

export default function RainOverlay(){
  const { rainActive } = useThemeMode()
  const [mounted,setMounted]=useState(false)
  useEffect(()=>setMounted(true),[])
  if(!mounted || !rainActive) return null
  return createPortal(
    <div className="fixed inset-0 pointer-events-none bg-black/20">
      {/* TODO(design): replace with Lottie rain; CSS drops as fallback */}
    </div>,
    document.getElementById('rain-root')!
  )
}