export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

// Next.js 15.2.4 requires this format instead of the edge runtime export
export default function middleware() {
  // Your middleware logic here
  // This can be empty if you're not doing anything specific in middleware
}
