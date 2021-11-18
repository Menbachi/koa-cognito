import MockContext from '../__mocks__/test.mock.context';
import { getTokenFromHeader } from './get.token.from.header';

describe('Get token from header', () => {
  test('Gets token from header with default key', async () => {
    const getToken = getTokenFromHeader();
    const headerMock = {
      token: 'Test-Cookie-1-2-3',
    };

    const ctx = new MockContext().setHeader(headerMock).context;

    const cookie = await getToken(ctx);
    expect(cookie).toBe('Test-Cookie-1-2-3');
  });

  test('Gets token from header with provided key', async () => {
    const getToken = getTokenFromHeader('test-key');
    const headerMock = {
      'test-key': 'Test-Cookie-1-2-3',
    };

    const ctx = new MockContext().setHeader(headerMock).context;

    const cookie = await getToken(ctx);
    expect(cookie).toBe('Test-Cookie-1-2-3');
  });

  test('Gets undefined when header is not found', async () => {
    const getToken = getTokenFromHeader();
    const headerMock = {};

    const ctx = new MockContext().setHeader(headerMock).context;

    const cookie = await getToken(ctx);
    expect(cookie).toBe(undefined);
  });
});
