interface HelloResponse {
  name: String;
  greeting: String;
}

export default {
  Query: {
    hello: (root: {}, args: { name: string }, context: {}): HelloResponse => ({
      name: args.name,
      greeting: `Hello ${args.name}`,
    }),
  },
};
