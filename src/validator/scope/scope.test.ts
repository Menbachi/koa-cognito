import MockContext from '../../__mocks__/test.mock.context';
import { getScopes, hasScope } from './scope';
import KoaCognitoHttpException from '../../errors/koa.cognito.http.exception';

describe('Gets scopes from user state', () => {
  test('Returns empty when user is undefined', () => {
    const ctx = new MockContext().setState({}).context;

    const response = getScopes(ctx);

    expect(response).toStrictEqual([]);
  });
  test('Returns empty when user has no scopes', () => {
    const ctx = new MockContext().setState({
      user: {
        scope: [],
      },
    }).context;

    const response = getScopes(ctx);

    expect(response).toStrictEqual([]);
  });

  test('Return scopes when they are set', () => {
    const ctx = new MockContext().setState({
      user: {
        scope: 'scope-1 scope-2',
      },
    }).context;

    const response = getScopes(ctx);

    expect(response).toStrictEqual(['scope-1', 'scope-2']);
  });
});

describe('Check if user has scope', () => {
  test('Throws when user has not selected scope', async () => {
    const ctx = new MockContext().setState({}).context;

    const middleware = hasScope('scope');
    const next = jest.fn();

    await expect(middleware(ctx, next)).rejects.toThrow(new KoaCognitoHttpException(403, 'Forbidden'));
    expect(next).toBeCalledTimes(0);
  });

  test('Execute next when user has selected scope', async () => {
    const ctx = new MockContext().setState({
      user: {
        scope: 'scope-1 scope-2 scope-3',
      },
    }).context;

    const middleware = hasScope('scope-1');
    const next = jest.fn();

    await expect(middleware(ctx, next)).resolves;
    expect(next).toBeCalledTimes(1);
  });
});
