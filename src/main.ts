import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// ✅ AJOUT
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {

  // ⚠️ IMPORTANT (type Express)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ================= CORS =================
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // ================= STATIC FILES (IMAGE) =================
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // ================= SWAGGER =================
  const config = new DocumentBuilder()
    .setTitle('API Tourisme')
    .setDescription('API pour gérer hôtels, agences, réservations, locations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ================= START SERVER =================
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(` Serveur démarré sur http://localhost:${port}`);
  console.log(` Swagger disponible sur http://localhost:${port}/api`);
  console.log(` Images accessibles sur http://localhost:${port}/uploads`);
}

bootstrap();