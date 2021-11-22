import { Context } from 'koa';
import { GetTokenFn } from './get.tokent';

export const getTokenFromHeader = (key = 'token'): GetTokenFn => {
  return (ctx: Context): Promise<string | undefined> => {
    const headerData = ctx.headers[key];

    if (!headerData) {
      return Promise.resolve(undefined);
    }

    if (Array.isArray(headerData)) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(headerData);
  };
};
