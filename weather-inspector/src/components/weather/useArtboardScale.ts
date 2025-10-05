'use client'
import { useEffect, useState } from 'react'

export function useArtboardScale(baseW = 1512, baseH = 982) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const onResize = () => {
      const s = Math.min(window.innerWidth / baseW, window.innerHeight / baseH)
      setScale(s)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return {
    containerStyle: {
      width: '100vw',
      height: '100dvh',
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden'
    } as React.CSSProperties,
    artboardStyle: {
      width: baseW,
      height: baseH,
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    } as React.CSSProperties
  }
}