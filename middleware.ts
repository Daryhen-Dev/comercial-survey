import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse, type NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

export default auth(function middleware(req) {
  const { pathname } = req.nextUrl

  // Admin protection
  if (pathname.startsWith('/admin') && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Ecuador IP restriction — only enforced in production on Vercel
  // req.geo is populated by Vercel's Edge Network automatically
  if (pathname.startsWith('/survey') && process.env.NODE_ENV === 'production') {
    const country = req.geo?.country

    // If Vercel geo is available and country is not Ecuador → block
    if (country && country !== 'EC') {
      return NextResponse.redirect(new URL('/acceso-restringido', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/survey/:path*'],
}
