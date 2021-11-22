import * as jwt from 'jsonwebtoken';
import { Pems } from '../cognito/cognito';

export const getTokenValidator = (pems: Pems): ((token: string) => jwt.JwtPayload) => {
  return async (token: string) => {
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      console.warn(`Cannot decode token: ${token}`);
      return undefined;
    }

    if (!Object.values(pems).some((pem) => decodedToken.payload.iss === pem.issuer)) {
      console.warn(`Cannot find pem issuer ${decodedToken.payload.iss}, pems: ${JSON.stringify(pems)}`);
      return undefined;
    }

    const kid = decodedToken.header.kid;
    if (!kid) {
      console.warn(`Cannot find kid in token`);
      return undefined;
    }

    const pem = pems[kid];
    if (!pem) {
      console.warn(`Cannot find pem by kid: ${kid}, pems: ${JSON.stringify(pems)}`);
      return undefined;
    }

    return jwt.verify(token, pem.key, { issuer: decodedToken.payload.iss });
  };
};
