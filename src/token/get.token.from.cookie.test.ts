import { getTokenFromCookie } from './get.token.from.cookie';
import MockContext from '../mocks/test.mock.context';

describe('Get token from cookie', () => {
  test('Gets cookie from token with default key', async () => {
    const getCookie = getTokenFromCookie();
    const cookieMock = {
      get: jest.fn().mockResolvedValue('Test-Cookie-1-2-3'),
    };

    const ctx = new MockContext().setCookie(cookieMock).context;

    const cookie = await getCookie(ctx);
    expect(cookieMock.get).toBeCalledWith('token');
    expect(cookie).toBe('Test-Cookie-1-2-3');
  });

  test('Gets cookie from token with provided key', async () => {
    const getCookie = getTokenFromCookie('test-key');
    const cookieMock = {
      get: jest.fn().mockResolvedValue('Test-Cookie-1-2-3'),
    };

    const ctx = new MockContext().setCookie(cookieMock).context;

    const cookie = await getCookie(ctx);
    expect(cookieMock.get).toBeCalledWith('test-key');
    expect(cookie).toBe('Test-Cookie-1-2-3');
  });

  test('Gets undefined when cookie is not found', async () => {
    const getCookie = getTokenFromCookie();
    const cookieMock = {
      get: jest.fn().mockResolvedValue(undefined),
    };

    const ctx = new MockContext().setCookie(cookieMock).context;

    const cookie = await getCookie(ctx);
    expect(cookieMock.get).toBeCalledWith('token');
    expect(cookie).toBe(undefined);
  });
});
