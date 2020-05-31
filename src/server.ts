import Koa from 'koa';
import KoaRouter from 'koa-router';
import { ApolloServer, gql } from 'apollo-server-koa';

import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';

import helloQuery from './queries/hello';

export function createApp(): Koa {
  const app = new Koa();
  const router = new KoaRouter();
  const server = new ApolloServer({
    typeDefs: gql(
      readFileSync(pathJoin(__dirname, 'schema/hello.graphql')).toString()
    ),
    context: ({ ctx }) => ctx,
    formatError: errorHandler,
    resolvers: {
      Query: helloQuery.Query,
    }
  });

  router.get('/healthz', ctx => { ctx.body = 'ok' });
  router.post('/graphql', server.getMiddleware());
  router.get('/graphql', server.getMiddleware());

  app.use(router.routes());
  app.use(router.allowedMethods());
  
  return app; 
}

const errorHandler = (err: Error) => {
  console.log('Error while running resolver', { error: err });
  return new Error('Internal server error');
}
