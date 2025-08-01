import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "./lib/auth/server"

const authRoutes = ["/signin", "/signup"]

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if auth + auth route, redirect to app
  if (authRoutes.includes(path) && session) {
    return NextResponse.redirect(new URL("/app", request.url))
  }

  if (!(session || authRoutes.includes(path))) {
    const redirectUrl = new URL("/signin", request.url)
    redirectUrl.searchParams.set("redirect", path)

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // app
    "/app/:path*",
    // auth routes
    "/(signin|signup)",
  ],
}
