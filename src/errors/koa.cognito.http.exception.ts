export enum HttpCode {
  Unauthorized = 401,
  Forbidden = 403,
}

export default class KoaCognitoHttpException extends Error {
  constructor(public readonly statusCode: HttpCode, message?: string) {
    super(message);
  }
}
