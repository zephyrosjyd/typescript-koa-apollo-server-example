import { createApp } from './server'

async function main() {
  const app = createApp();
  const port = process.env.PORT || 3100;

  app.listen(port);
  console.log(`Listening on port ${port}`);
}

if (require.main === module) {
  main();
}
