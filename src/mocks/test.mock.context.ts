/* eslint-disable */

// @ts-nocheck
import { Context } from 'koa';

export default class MockContext {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  public context: Context = {}

  public setParams(params: unknown) {
    this.context.params = params;

    return this;
  }

  public setQuery(query: unknown) {
    this.context.query = query;

    return this;
  }

  public setBody(body: unknown) {
    this.context.request = this.context.request ?? { body };

    return this;
  }
  public setCookie(cookies: unknown) {
    this.context.cookies = cookies;

    return this;
  }
}
