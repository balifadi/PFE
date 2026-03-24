import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Crée l'application NestJS
  const app = await NestFactory.create(AppModule);

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Tourisme')
    .setDescription('API pour gérer hôtels,agences,réservations,locations')
    .setVersion('1.0')
    .addBearerAuth() // Si tu utilises JWT pour l'authentification
    .build();
  
  // Génération de la documentation Swagger
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Lancement du serveur sur le port configuré ou 3000 par défaut
  const port = process.env.PORT || 3000;
  await app.listen(port);

 // Affichage des URLs dans le terminal pour tester facilement
  console.log(` Serveur démarré sur http://localhost:${port}`);
  console.log(` Swagger disponible sur http://localhost:${port}/api`);
}

bootstrap();