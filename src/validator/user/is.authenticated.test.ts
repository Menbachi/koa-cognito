import MockContext from '../../__mocks__/test.mock.context';
import { getUser, isAuthenticated } from './is.authenticated';
import KoaCognitoHttpException from '../../errors/koa.cognito.http.exception';

describe('Gets user from state', () => {
  test('Gets undefined when user is not set', () => {
    const ctx = new MockContext().setState({}).context;

    const response = getUser(ctx);
    expect(response).toBeUndefined();
  });
  test('Gets user from state when user is set', () => {
    const ctx = new MockContext().setState({
      user: {
        id: 1,
      },
    }).context;

    const response = getUser(ctx);
    expect(response).toStrictEqual({ id: 1 });
  });
});

describe('Check user authorization', () => {
  test('Throws unauthorized exception when user is not authorized', async () => {
    const ctx = new MockContext().setState({}).context;
    const next = jest.fn();

    await expect(isAuthenticated(ctx, next)).rejects.toThrow(new KoaCognitoHttpException(401));
    expect(next).toBeCalledTimes(0);
  });

  test('Execute next function when user is found', async () => {
    const ctx = new MockContext().setState({
      user: true,
    }).context;
    const next = jest.fn();

    await expect(isAuthenticated(ctx, next)).resolves;
    expect(next).toBeCalledTimes(1);
  });
});
