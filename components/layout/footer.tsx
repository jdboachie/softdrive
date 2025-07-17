import React from 'react'
import ThemeToggle from '@/components/theme/theme-toggle'

export default function Footer() {
  return (
    <footer className='border-t'>
      <div className='p-3 px-6 flex justify-between items-center containor'>
        <span className="text-muted-foreground font-medium text-sm">&copy; 2025 Softdrive</span>
        <ThemeToggle />
      </div>
    </footer>
  )
}
