import type { NextAuthConfig } from 'next-auth'

// Lightweight config — no Node.js imports (bcrypt, prisma)
// Used by middleware (Edge Runtime)
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [], // providers added in lib/auth.ts (Node.js only)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      if (isAdminRoute && !isLoggedIn) {
        return false // redirects to pages.signIn automatically
      }
      return true
    },
  },
}
