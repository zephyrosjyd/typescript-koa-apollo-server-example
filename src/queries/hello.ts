export default {
  Query: {
    hello: (root: {}, args: { name: string }, context: {}): String => `Hello ${args.name}`,
  },
};
