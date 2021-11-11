import { Context, Middleware, Next } from 'koa';
import { getToken, GetTokenConfig } from './token/get.tokent';
import { CognitoConfiguration, getAllPems, getPems } from './cognito/cognito';

export interface AuthorizerConfig {
  token?: GetTokenConfig;
  cognito: CognitoConfiguration[];
}

export const authorizer = async (config: AuthorizerConfig): Promise<Middleware> => {
  const pems = await getAllPems(config.cognito);

  return async (ctx: Context, next: Next) => {
    const token = await getToken(ctx, config.token);

    await next();
  };
};
