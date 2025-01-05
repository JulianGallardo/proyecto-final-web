import { NextRequest } from "next/server"
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { match } from "assert"

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest) {
    // Your custom middleware logic goes here
    const session = auth();
    if (!session) {
        return NextResponse.rewrite(new URL('/login', req.url))
    }


    if (req.nextUrl.pathname === "/") {
        return NextResponse.rewrite(new URL('/login', req.url))
    }
})

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
  }