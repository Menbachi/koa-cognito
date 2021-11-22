import { Context, Next } from 'koa';
import KoaCognitoHttpException, { HttpCode } from './errors/koa.cognito.http.exception';

export const hasGroup = (group: string) => async (ctx: Context, next: Next) => {
  const groups = getGroups(ctx);
  if (!groups.some((g: string) => g === group)) {
    throw new KoaCognitoHttpException(HttpCode.Forbidden);
  }

  await next();
};

export const getGroups = (ctx: Context): string[] => {
  const { user } = ctx.state;
  if (!user) {
    return [];
  }

  const groups = user['cognito:groups'];
  if (!groups || !(groups instanceof Array)) {
    return [];
  }

  return groups;
};
