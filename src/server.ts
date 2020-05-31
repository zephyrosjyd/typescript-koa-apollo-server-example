import Koa from 'koa';
import KoaRouter from 'koa-router';
import { ApolloServer, gql } from 'apollo-server-koa';

export function createApp(): Koa {
  const app = new Koa();
  const router = new KoaRouter();
  const server = new ApolloServer({
    typeDefs: gql(`
      schema {
        query: Query
      }

      type Query {
        hello(name: String): String
      }
    `),
    context: ({ ctx }) => ctx,
    formatError: errorHandler,
    resolvers: {
      Query: {
        hello: function hello(
          root: {},
          args: { name: string },
          context: {}
        ): String {
          return `Hello ${args.name}`;
        }
      },
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
