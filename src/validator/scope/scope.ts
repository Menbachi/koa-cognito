import { Context, Next } from 'koa';
import KoaCognitoHttpException, { HttpCode } from '../../errors/koa.cognito.http.exception';

export const hasScope = (scope: string) => async (ctx: Context, next: Next) => {
  const scopes = getScopes(ctx);

  if (!scopes.some((s) => s === scope)) {
    throw new KoaCognitoHttpException(HttpCode.Forbidden);
  }

  await next();
};

export const getScopes = (ctx: Context) => {
  const { user } = ctx.state;
  if (!user) {
    return [];
  }

  const { scope } = user;
  if (!scope || typeof scope !== 'string') {
    return [];
  }

  return scope.split(' ');
};
