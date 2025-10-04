'use client';

import React from 'react';
import { useThemeMode } from '@/lib/theme';

export default function LayoutContent({ children }:{ children: React.ReactNode }) {
  const { mode } = useThemeMode();

  return (
    <body className={mode === 'weather' ? 'mode-weather' : 'mode-noir'}>
      {/* rain overlay portal */}
      <div id="rain-root" />
      {children}
    </body>
  );
}