import jwt from 'jsonwebtoken';
import jwkToPem, { JWK } from 'jwk-to-pem';

export interface CognitoConfiguration {
  region: string;
  userPoolId: string;
}

export const compareTokenWithKid = () => {};
export const verifyTheClaims = () => {};

export type Pems = { [key: string]: string };

export const getPems = async ({ region, userPoolId }: CognitoConfiguration): Promise<Pems> => {
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const response = await fetch(url);
  const jwk = await response.json();

  // @TODO - find better way for typesafe kid & JWK
  return jwk?.keys?.reduce((prev: any, current: { kid: any } & jwkToPem.JWK) => {
    return { ...prev, [current.kid]: jwkToPem(current) };
  }, {});
};

export const getAllPems = async (configurations: CognitoConfiguration[]): Promise<Pems> => {
  const allPems = await Promise.all(configurations.map((config) => getPems(config)));

  return allPems.reduce((prev, current) => ({ ...prev, ...current }), {});
};

export const testToken = async (configuration: CognitoConfiguration[]) => {
  const pems = await getAllPems(configuration);

  return async (token: string) => {
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      console.warn(`Cannot decode token: ${token}`);
      return undefined;
    }

    if (!Object.values(pems).some((pemIssuer) => decodedToken.payload.iss === pemIssuer)) {
      console.warn(`Cannod find pem issuer ${decodedToken.payload.iss}, pems: ${pems}`);
      return undefined;
    }
    const kid = decodedToken.header.kid
    if(!kid) {
      console.warn(`Cannot find kid in token`);
      return undefined;
    }
    const pem = pems[kid];
    if (!pem) {
      console.warn(`Cannot find pem by kid: ${kid}, pems: ${pems}`);
      return undefined;
    }

    return jwt.verify(token, pem, { issuer: decodedToken.payload.iss })
  };
};
