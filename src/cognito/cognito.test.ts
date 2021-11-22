import { getAllPems, getPems } from './cognito';
import axios from 'axios';
const mockedAxios = jest.spyOn(axios, 'get');

const createMockKey = (key: string) => ({
  alg: 'RS256',
  e: 'AQAB',
  key,
  kty: 'RSA',
  n: 'lsjhglskjhgslkjgh43lj5h34lkjh34lkjht3example',
  use: 'sig',
});

describe('Pems', () => {
  test('Response with keys for pems', async () => {
    mockedAxios.mockResolvedValue({
      data: {
        keys: [createMockKey('key-A'), createMockKey('key-B'), createMockKey('key-C')],
      },
    });
    const configuration = { region: 'exampleRegion', userPoolId: 'exampleUserPoolId' };
    const response = await getPems(configuration);

    expect(mockedAxios).toBeCalledWith(
      `https://cognito-idp.${configuration.region}.amazonaws.com/${configuration.userPoolId}/.well-known/jwks.json`
    );
    expect(response).toMatchSnapshot();
  });

  test('Response with keys for pems for all configuration regions', async () => {
    mockedAxios
      .mockResolvedValueOnce({
        data: {
          keys: [createMockKey('key-A')],
        },
      })
      .mockResolvedValueOnce({
        data: {
          keys: [createMockKey('key-C')],
        },
      });
    const configuration = [
      { region: 'exampleRegion1', userPoolId: 'exampleUserPoolId1' },
      { region: 'exampleRegion2', userPoolId: 'exampleUserPoolId2' },
    ];
    const response = await getAllPems(configuration);

    expect(mockedAxios).toHaveBeenCalledTimes(2);
    expect(mockedAxios).toHaveBeenCalledWith(
      `https://cognito-idp.${configuration[0].region}.amazonaws.com/${configuration[0].userPoolId}/.well-known/jwks.json`
    );
    expect(mockedAxios).toHaveBeenCalledWith(
      `https://cognito-idp.${configuration[1].region}.amazonaws.com/${configuration[1].userPoolId}/.well-known/jwks.json`
    );
    expect(response).toMatchSnapshot();
  });
});
