import Koa from 'koa';
import KoaRouter from 'koa-router';
import { ApolloServer, gql } from 'apollo-server-koa';

import { readFileSync, readdirSync } from 'fs';
import { join as pathJoin } from 'path';

import helloQuery from './queries/hello';

export function createApp(): Koa {
  const app = new Koa();
  const router = new KoaRouter();

  const schemaFiles = readdirSync(pathJoin(__dirname, 'schema'))
    .filter(file => file.indexOf('.graphql') > 0);

  const schema = schemaFiles
    .map(file => readFileSync(pathJoin(__dirname, `schema/${file}`)).toString())
    .join();
  
  const queryResolvers = schemaFiles
    .map(file => file.replace('.graphql', ''))
    .map(file => require(pathJoin(__dirname, `queries/${file}`)).default)
    .reduce((initial, current) => ({
      ...initial,
      ...current.Query,
    }), {});

  const server = new ApolloServer({
    typeDefs: gql(`
      type Query

      schema {
        query: Query
      }
      
      ${schema}
    `),
    resolvers: {
      Query: queryResolvers,
    },
    formatError: errorHandler,
    context: ({ ctx }) => ctx
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
