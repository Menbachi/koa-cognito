import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

export interface CognitoConfiguration {
  region: string;
  userPoolId: string;
}

export type Pems = {
  [key: string]: {
    key: string;
    issuer: string;
  };
};

export const getPems = async ({ region, userPoolId }: CognitoConfiguration): Promise<Pems> => {
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const response = await axios.get(url);
  const jwk = response.data;

  // @TODO - find better way for typesafe kid & JWK
  return jwk?.keys?.reduce((prev: any, current: { kid: any } & jwkToPem.JWK) => {
    return {
      ...prev,
      [current.kid]: {
        key: jwkToPem(current),
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      },
    };
  }, {});
};

export const getAllPems = async (configurations: CognitoConfiguration[]): Promise<Pems> => {
  const allPems = await Promise.all(configurations.map((config) => getPems(config)));

  return allPems.reduce((prev, current) => ({ ...prev, ...current }), {});
};
