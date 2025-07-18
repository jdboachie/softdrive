import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/t", "/t/:teamId", "/t/:teamId/(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isSignedIn = await convexAuth.isAuthenticated();

  if (isSignInPage(request) && isSignedIn) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  if (isProtectedRoute(request) && !isSignedIn) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }

  return null;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
