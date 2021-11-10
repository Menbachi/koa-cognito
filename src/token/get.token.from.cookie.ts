import { Context } from 'koa';
import { GetTokenFn } from './get.tokent';

export const getTokenFromCookie = (key = 'token'): GetTokenFn => {
  return async (ctx: Context): Promise<string | undefined> => {
    return ctx.cookies.get(key);
  };
};
