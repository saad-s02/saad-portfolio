import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      '/',
      '/about',
      '/resume',
      '/projects',
      '/projects/:path*',
      '/stack',
      '/contact',
      '/auth/:path*',
    ],
  },
  // Enable synchronous access token availability for Convex integration
  eagerAuth: true,
});

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
