import { Context, Next } from 'koa';
import KoaCognitoHttpException from './koa.cognito.http.exception';

export const koaCognitoErrorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof KoaCognitoHttpException) {
      ctx.body = {
        message
      }
    }
    throw error;
  }
};
