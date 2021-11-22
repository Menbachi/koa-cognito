import { Context, Next } from 'koa';
import KoaCognitoHttpException, { HttpCode } from './errors/koa.cognito.http.exception';

export const isAuthenticated = async (ctx: Context, next: Next) => {
  const user = getUser(ctx);
  if (!user) {
    throw new KoaCognitoHttpException(HttpCode.Unauthorized);
  }

  await next();
};

export const getUser = (ctx: Context) => {
  const { user } = ctx.state;

  return user;
};
