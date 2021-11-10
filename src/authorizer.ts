import { Context, Middleware, Next } from 'koa';
import { getToken, GetTokenConfig } from './token/get.tokent';

export interface AuthorizerConfig {
  token?: GetTokenConfig;
}

export const authorizer = (config: AuthorizerConfig): Middleware => {
  return async (ctx: Context, next: Next) => {
    const token = await getToken(ctx, config.token);

    await next();
  };
};
