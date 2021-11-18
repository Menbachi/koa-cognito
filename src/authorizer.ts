import { Context, Middleware, Next } from 'koa';
import { getToken, GetTokenConfig } from './token/get.tokent';
import { CognitoConfiguration, getAllPems, getTokenValidator } from './cognito/cognito';

export interface AuthorizerConfig {
  token?: GetTokenConfig;
  cognito: CognitoConfiguration[];
}

export const getAuthorizer = async (config: AuthorizerConfig): Promise<Middleware> => {
  const pems = await getAllPems(config.cognito);
  const tokenValidator = await getTokenValidator(pems);

  return async (ctx: Context, next: Next) => {
    const token = await getToken(ctx, config.key);
    if (token) {
      const user = await tokenValidator(token);
      ctx.state = { ...ctx.state, user };
    }

    await next();
  };
};
