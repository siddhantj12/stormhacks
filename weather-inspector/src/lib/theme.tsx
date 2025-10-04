'use client'
import { createContext, useContext, useState } from 'react'

type Mode = 'weather' | 'noir'
type Ctx = { mode: Mode; setMode: (m:Mode)=>void; rainActive: boolean; setRainActive:(b:boolean)=>void }
const ThemeCtx = createContext<Ctx | null>(null)

export function ThemeProvider({ children }:{children:React.ReactNode}) {
  const [mode, setMode] = useState<Mode>('weather')
  const [rainActive, setRainActive] = useState(false)
  return <ThemeCtx.Provider value={{ mode, setMode, rainActive, setRainActive }}>{children}</ThemeCtx.Provider>
}
export function useThemeMode(){ const v = useContext(ThemeCtx); if(!v) throw new Error('ThemeCtx'); return v }