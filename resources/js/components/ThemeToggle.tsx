import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>('light')

  useEffect(() => {
    const t = localStorage.getItem('theme') as 'light'|'dark'|null
    if (t) setTheme(t)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme((t) => t === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </Button>
  )
}
