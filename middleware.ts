import { NextRequest, NextResponse } from "next/server"

// protected pages
const protectedPaths = ["/", "/browse"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  // cookie presence check (Edge friendly)
  const token = req.cookies.get("token")?.value
  const isLoggedIn = Boolean(token)

  // redirect unauthenticated users to /login
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // optional: logged-in users visiting /login or /register → home
  if (isLoggedIn && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

/* match all routes except Next.js internals + public files */
export const config = {
  matcher: ["/((?!api|_next/|favicon.ico).*)"],
}


