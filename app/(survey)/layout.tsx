import Link from 'next/link'
import { Home } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Link
          href="/survey"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="size-3.5" />
          Inicio
        </Link>
        <ThemeToggle />
      </header>
      <main className="min-h-screen flex flex-col items-center justify-start pt-12 px-4">
        {children}
      </main>
    </div>
  )
}
