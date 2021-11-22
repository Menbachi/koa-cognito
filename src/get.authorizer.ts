import { Context, Middleware, Next } from 'koa';
import { getToken, GetTokenConfig } from './token/get.tokent';
import { CognitoConfiguration, getAllPems } from './cognito/cognito';
import { getTokenValidator } from './validator/token.validtor';
import KoaCognitoHttpException, { HttpCode } from './errors/koa.cognito.http.exception';

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

export const hasScope = (scope: string) => async (ctx: Context, next: Next) => {
  const { user } = ctx.state;
  if (!user) {
    throw new KoaCognitoHttpException(HttpCode.Unauthorized);
  }

  const { scope } = user;
  if (!scope || typeof scope !== 'string') {
    throw new KoaCognitoHttpException(HttpCode.Unauthorized);
  }

  const userScopes = scope.split(' ');
  if (!userScopes.some((s) => s === scope)) {
    throw new KoaCognitoHttpException(HttpCode.Forbidden);
  }

  await next();
};

export const hasGroup = (group: string) => async (ctx: Context, next: Next) => {
  const { user } = ctx.state;
  if (!user) {
    throw new KoaCognitoHttpException(HttpCode.Unauthorized);
  }

  const groups = user['cognito:groups'];
  if (!groups || !(groups instanceof Array)) {
    throw new KoaCognitoHttpException(HttpCode.Unauthorized);
  }

  if (!groups.some((s) => s === group)) {
    throw new KoaCognitoHttpException(HttpCode.Forbidden);
  }

  await next();
};

export const isAuthenticated = async (ctx: Context, next: Next) => {
  const { user } = ctx.state;
  if (!user) {
    throw new KoaCognitoHttpException(HttpCode.Unauthorized);
  }

  await next();
};
