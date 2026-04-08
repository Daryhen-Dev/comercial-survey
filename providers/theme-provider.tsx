'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useServerInsertedHTML } from 'next/navigation'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme | undefined
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

const STORAGE_KEY = 'theme'
const MEDIA = '(prefers-color-scheme: dark)'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA).matches ? 'dark' : 'light'
}

function getStoredTheme(defaultTheme: Theme): Theme {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? defaultTheme
  } catch {
    return defaultTheme
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  disableTransitionOnChange?: boolean
  // accepted for API compat but unused — theme class is always applied to <html>
  attribute?: string
  enableSystem?: boolean
}) {
  // Inject the initialization script into the SSR HTML stream.
  // useServerInsertedHTML runs server-side only, so the <script> never
  // enters the React tree on the client — no React 19 warning.
  useServerInsertedHTML(() => (
    <script
      key="theme-init"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'${defaultTheme}';if(t==='system')t=window.matchMedia('${MEDIA}').matches?'dark':'light';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t);}catch(e){}})()`,
      }}
    />
  ))

  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme | undefined>(undefined)

  // Hydrate from localStorage and start watching system preference
  useEffect(() => {
    setThemeState(getStoredTheme(defaultTheme))
    setSystemTheme(getSystemTheme())

    const mq = window.matchMedia(MEDIA)
    const handler = (e: MediaQueryListEvent) =>
      setSystemTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [defaultTheme])

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemTheme ?? 'dark') : (theme as ResolvedTheme)

  // Apply theme class to <html> on change
  useEffect(() => {
    const root = document.documentElement

    if (disableTransitionOnChange) {
      const style = document.createElement('style')
      style.textContent = '*,*::before,*::after{transition:none!important}'
      document.head.appendChild(style)
      root.classList.remove('light', 'dark')
      root.classList.add(resolvedTheme)
      // Flush paint then re-enable transitions
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.head.removeChild(style)),
      )
    } else {
      root.classList.remove('light', 'dark')
      root.classList.add(resolvedTheme)
    }
  }, [resolvedTheme, disableTransitionOnChange])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme, systemTheme }),
    [theme, setTheme, resolvedTheme, systemTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
