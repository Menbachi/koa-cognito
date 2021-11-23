import { getGroups, hasGroup } from './group';
import MockContext from '../../__mocks__/test.mock.context';
import KoaCognitoHttpException from '../../errors/koa.cognito.http.exception';

describe('Gets groups from user state', () => {
  test('Returns empty when user is undefined', () => {
    const ctx = new MockContext().setState({}).context;

    const response = getGroups(ctx);

    expect(response).toStrictEqual([]);
  });
  test('Returns empty when user has no cognito groups', () => {
    const ctx = new MockContext().setState({
      user: {
        'cognito:groups': [],
      },
    }).context;

    const response = getGroups(ctx);

    expect(response).toStrictEqual([]);
  });
  test('Return groups when they are set', () => {
    const groups = ['group-1', 'group-2'];
    const ctx = new MockContext().setState({
      user: {
        'cognito:groups': groups,
      },
    }).context;

    const response = getGroups(ctx);

    expect(response).toStrictEqual(groups);
  });

  test('Return empty array when user is set, but has no groups as string', () => {
    const ctx = new MockContext().setState({
      user: {
        'cognito:groups': 'unknownw',
      },
    }).context;

    const response = getGroups(ctx);

    expect(response).toStrictEqual([]);
  });
  test('Return empty array when user is set, but group is not set', () => {
    const ctx = new MockContext().setState({
      user: {},
    }).context;

    const response = getGroups(ctx);

    expect(response).toStrictEqual([]);
  });
});

describe('Check if user has selected group', () => {
  test(`Throws Forbidden when user doesn't have grop`, async () => {
    const middleware = hasGroup('group-1');
    const ctx = new MockContext().setState({}).context;
    const next = jest.fn();

    await expect(middleware(ctx, next)).rejects.toThrow(new KoaCognitoHttpException(403, 'Forbidden'));
    expect(next).toBeCalledTimes(0);
  });

  test(`Executes next middleware when user has selected group`, async () => {
    const middleware = hasGroup('group-1');
    const ctx = new MockContext().setState({
      user: {
        'cognito:groups': ['group-1', 'group-2'],
      },
    }).context;
    const next = jest.fn();

    await expect(middleware(ctx, next)).resolves;
    expect(next).toBeCalledTimes(1);
  });
});
