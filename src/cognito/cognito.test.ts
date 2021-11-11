import { getAllPems, getPems } from './cognito';

const createKey = (kid: string) => ({
  alg: 'RS256',
  e: 'AQAB',
  kid,
  kty: 'RSA',
  n: 'lsjhglskjhgslkjgh43lj5h34lkjh34lkjht3example',
  use: 'sig',
});

describe('Pems', () => {
  test('Response with keys for pems', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => ({
        keys: [createKey('kid-A'), createKey('kid-B'), createKey('kid-C')],
      }),
    });
    const configuration = { region: 'exampleRegion', userPoolId: 'exampleUserPoolId' };
    const response = await getPems(configuration);

    expect(global.fetch).toBeCalledWith(
      `https://cognito-idp.${configuration.region}.amazonaws.com/${configuration.userPoolId}/.well-known/jwks.json`
    );
    expect(response).toMatchSnapshot();
  });

  test('Response with keys for pems for all configuration regions', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => ({
          keys: [createKey('kid-A')],
        }),
      })
      .mockResolvedValueOnce({
        json: () => ({
          keys: [createKey('kid-C')],
        }),
      });
    const configuration = [
      { region: 'exampleRegion1', userPoolId: 'exampleUserPoolId1' },
      { region: 'exampleRegion2', userPoolId: 'exampleUserPoolId2' },
    ];
    const response = await getAllPems(configuration);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      `https://cognito-idp.${configuration[0].region}.amazonaws.com/${configuration[0].userPoolId}/.well-known/jwks.json`
    );
    expect(global.fetch).toHaveBeenCalledWith(
      `https://cognito-idp.${configuration[1].region}.amazonaws.com/${configuration[1].userPoolId}/.well-known/jwks.json`
    );
    console.log({ response });
    expect(response).toMatchSnapshot();
  });
});
