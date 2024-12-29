import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that are public (do not require authentication)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/events/:id",
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
  "/api/uploadthing",
]);

// Define routes that are ignored and should not trigger authentication
const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
  "/api/uploadthing",
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect routes that are not public or ignored
  if (!isPublicRoute(request) && !isIgnoredRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Always allow public API webhooks
    "/api/webhooks/:path*",
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
