# Koa-Cognito

Koa-cognito is simple middleware that will allow you to authenticate user with amazon cognito

Will search for JWT in header or cookie with default key = `token`

## Installation
```bash
npm i @menbachi/koa-cognito
```

## Usage
You can see example in [example/index.ts](https://github.com/Menbachi/koa-cognito/blob/main/example/index.ts) file.

Simplest validation:
```typescript
import Koa from 'koa';
import { getAuthorizer, isAuthenticated } from '@menbachi/koa-cognito';

const bootstrap = async () => {
  const app = new Koa();

  const authorizeRequest = await getAuthorizer({
    cognito: [
      {
        region: 'eu-central-1',
        userPoolId: 'eu-central-1_pool',
      },
    ],
  });
  
  // Gets token from header/cookie and parse it to ctx.state.user object
  app.use(authorizeRequest);  
  
  // Check if user is authenticated
  app.use(isAuthenticated);  
}
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
## Tests
Feel free to test untested code
```typescript
--------------------------------|---------|----------|---------|---------|-------------------
File                            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------|---------|----------|---------|---------|-------------------
All files                       |   81.65 |    75.86 |   87.09 |   78.57 |                  
 cognito                        |     100 |       75 |     100 |     100 |                  
  cognito.ts                    |     100 |       75 |     100 |     100 | 22               
 errors                         |     100 |      100 |     100 |     100 |                  
  koa.cognito.http.exception.ts |     100 |      100 |     100 |     100 |                  
 token                          |   92.85 |       75 |     100 |    90.9 |                  
  get.token.from.cookie.ts      |     100 |      100 |     100 |     100 |                  
  get.token.from.header.ts      |   88.88 |    66.66 |     100 |    87.5 | 13               
 validator                      |   13.63 |        0 |       0 |   10.52 |                  
  token.validtor.ts             |   13.63 |        0 |       0 |   10.52 | 5-29             
 validator/group                |     100 |      100 |     100 |     100 |                  
  group.ts                      |     100 |      100 |     100 |     100 |                  
 validator/scope                |     100 |      100 |     100 |     100 |                  
  scope.ts                      |     100 |      100 |     100 |     100 |                  
 validator/user                 |     100 |      100 |     100 |     100 |                  
  is.authenticated.ts           |     100 |      100 |     100 |     100 |                  
--------------------------------|---------|----------|---------|---------|-------------------
```


## Simple docs
`AuthorizerConfig` - authorizer config type

`KoaCognitoHttpException` - Exception thrown when unauthorized/forbidden

`getAuthorizer(config: AuthorizerConfig)` - gets request authorizer

`hasScope(scope: string)` - Middleware that check if user has selected scope

`hasGroup(group: string)` - Middleware that check if user has selected group

`isAuthenticated()` - Middleware that check if user is logged in 

`getGroups(ctx: Context)` - gets group from request user

`getScopes(ctx: Context)` - gets scopes from request user

`getUser(ctx: Context)` - gets user from request

`getTokenFromCookie(key: string)` - look for jwt in cookie with default key = `token`

`getTokenFromHeader(key: string)` - look for jwt in headers with default key = `token`

## Thanks to `Eugene Lazutkin`

It was highly based on [koa-cognito-middleware](https://github.com/uhop/koa-cognito-middleware) by [Eugener Lazutkin](https://github.com/uhop). Made some changes to codebase and added tests.

## License
[MIT](https://choosealicense.com/licenses/mit/)

