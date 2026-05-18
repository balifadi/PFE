import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { seedDemoCatalog } from './demo-catalog.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    await seedDemoCatalog(app);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  // Keep the script exit code non-zero if the seed fails.
  console.error(error);
  process.exit(1);
});
