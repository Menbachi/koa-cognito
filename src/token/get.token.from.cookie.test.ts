import { getTokenFromCookie } from './get.token.from.cookie';
import MockContext from '../__mocks__/test.mock.context';

describe('Get token from cookie', () => {
  test('Gets token from cookie with default key', async () => {
    const getToken = getTokenFromCookie();
    const cookieMock = {
      get: jest.fn().mockResolvedValue('Test-Cookie-1-2-3'),
    };

    const ctx = new MockContext().setCookie(cookieMock).context;

    const cookie = await getToken(ctx);
    expect(cookieMock.get).toBeCalledWith('token');
    expect(cookie).toBe('Test-Cookie-1-2-3');
  });

  test('Gets token from cookie with provided key', async () => {
    const getToken = getTokenFromCookie('test-key');
    const cookieMock = {
      get: jest.fn().mockResolvedValue('Test-Cookie-1-2-3'),
    };

    const ctx = new MockContext().setCookie(cookieMock).context;

    const cookie = await getToken(ctx);
    expect(cookieMock.get).toBeCalledWith('test-key');
    expect(cookie).toBe('Test-Cookie-1-2-3');
  });

  test('Gets undefined when token is not found', async () => {
    const getToken = getTokenFromCookie();
    const cookieMock = {
      get: jest.fn().mockResolvedValue(undefined),
    };

    const ctx = new MockContext().setCookie(cookieMock).context;

    const cookie = await getToken(ctx);
    expect(cookieMock.get).toBeCalledWith('token');
    expect(cookie).toBe(undefined);
  });
});
