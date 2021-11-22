import { Context, Middleware, Next } from 'koa';
import { getToken, GetTokenConfig } from './token/get.tokent';
import { CognitoConfiguration, getAllPems } from './cognito/cognito';
import { getTokenValidator } from './validator/token.validtor';

export interface AuthorizerConfig {
  token?: GetTokenConfig;
  cognito: CognitoConfiguration[];
}

export const getAuthorizer = async (config: AuthorizerConfig): Promise<Middleware> => {
  const pems = await getAllPems(config.cognito);
  const tokenValidator = await getTokenValidator(pems);

  return async (ctx: Context, next: Next) => {
    const token = await getToken(ctx, config.token);
    if (token) {
      const user = await tokenValidator(token);
      ctx.state = { ...ctx.state, user };
    }

    await next();
  };
};
