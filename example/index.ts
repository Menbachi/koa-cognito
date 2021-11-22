import Koa from 'koa';
import {
  hasScope,
  hasGroup,
  getGroups,
  getScopes,
  getUser,
  AuthorizerConfig,
  getAuthorizer,
  isAuthenticated,
  getTokenFromCookie,
  getTokenFromHeader,
} from 'koa-cognito';

const config: AuthorizerConfig = {
  token: {
    getTokenMethods: [getTokenFromCookie(), getTokenFromHeader()],
  },
  cognito: [
    {
      region: 'eu-central-1',
      userPoolId: 'eu-central-1_pool',
    },
    {
      region: 'eu-west-1',
      userPoolId: 'eu-west-1_pool',
    },
  ],
};

const bootstrap = async () => {
  const app = new Koa();

  const authorizeRequest = await getAuthorizer(config);
  app.use(authorizeRequest);

  app.use(hasGroup('group-1'));
  app.use(async (ctx) => {
    const userGroups = getGroups(ctx);
    const userScopes = getScopes(ctx);
    const user = getUser(ctx);

    ctx.body = 'Hello World';
  });

  app.use(hasScope('scope-1'));

  app.use(isAuthenticated);
  app.listen(3000);
};
