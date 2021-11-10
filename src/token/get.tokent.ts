import { Context } from 'koa';
import { getTokenFromHeader } from './get.token.from.header';
import { getTokenFromCookie } from './get.token.from.cookie';

export type GetTokenFn = (ctx: Context) => Promise<string | undefined>;

export interface GetTokenConfig {
  getTokenMethods: Array<GetTokenFn>;
}

const defaultGetTokenConfig: GetTokenConfig = {
  getTokenMethods: [getTokenFromHeader(), getTokenFromCookie()],
};

export const getToken = async (
  ctx: Context,
  config: GetTokenConfig = defaultGetTokenConfig
): Promise<string | undefined> => {
  for (const getTokenMethod of config.getTokenMethods) {
    const probableToken = await getTokenMethod(ctx);

    if (probableToken) {
      return probableToken;
    }
  }

  return undefined;
};
