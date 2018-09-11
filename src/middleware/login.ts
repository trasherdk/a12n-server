import { Middleware } from '@curveball/core';

const whitelistPath = [
  '/login',
  '/assets',
  '/health',
  '/authorize',
];

export default function (): Middleware {

  return (ctx, next): void|Promise<void> => {

    if (ctx.state.session.data.user) {
      // User is logged in.
      return next();
    }

    for(const path of whitelistPath) {

      if (ctx.path === path || ctx.path.startsWith(path + '/')) {
        // In whitelist
        return next();
      }
    }

    // Not logged in.
    ctx.status = 302;
    ctx.response.headers.set('Location', '/login');

  };

}