import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create the Nest.js application instance
  const app = await NestFactory.create(AppModule);

  // Add global validation pipe for all routes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Start listening on port 3000. Since the app is running in a Docker container, the port is certain to be available.
  await app.listen(3000);
}
bootstrap();
