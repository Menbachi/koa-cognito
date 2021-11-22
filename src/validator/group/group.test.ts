import { getGroups } from './group';
import MockContext from './__mocks__/test.mock.context';

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
});
