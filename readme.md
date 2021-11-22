# Koa-Cognito

Koa-cognito is simple middleware that will allow you to authenticate user with amazon cognito

Will search for JWT in header or cookie with default key = `token`

## Installation
```bash
npm i koa-cognito
```

## Usage
You can see example in [example/index.ts](https://github.com/Menbachi/koa-cognito/blob/main/example/index.ts) file.

Simplest validation:
```typescript
import Koa from 'koa';
import { getAuthorizer, isAuthenticated } from 'koa-cognito';

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

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Simple docs
`AuthorizerConfig` - authorizer config type

`getAuthorizer(config: AuthorizerConfig)` - gets request authorizer

`hasScope` - Middleware that check if user has selected scope

`hasGroup` - Middleware that check if user has selected group

`isAuthenticated` - Middleware that check if user is logged in 

`getGroups(ctx: Context)` - gets group from request user

`getScopes(ctx: Context)` - gets scopes from request user

`getUser(ctx: Context)` - gets user from request

`getTokenFromCookie(key: string)` - look for jwt in cookie with default key = `token`

`getTokenFromHeader(key: string)` - look for jwt in headers with default key = `token`