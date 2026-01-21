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
    ],
  },
});

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
