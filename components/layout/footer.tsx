import React from 'react'
import ThemeToggle from '@/components/theme/theme-toggle'

export default function Footer() {
  return (
    <footer className='p-6 flex justify-between items-center border-t'>
      <span className="text-muted-foreground font-medium text-sm">&copy; 2025 Softdrive</span>
      <ThemeToggle />
    </footer>
  )
}
