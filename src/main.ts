// Import necessary modules from Nest.js core and common packages
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from './modules/app/app.module';
import { CustomValidationPipe } from './common/validation/custom-dto.validation';

// Bootstrap function to initialize the application
async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.create(AppModule, { cors: true });

  // Use Helmet for basic security headers
  app.use(helmet());

  // Use global validation pipe with whitelist option enabled
  app.useGlobalPipes(new CustomValidationPipe());

  // Set a global prefix for all routes, excluding the root and health check routes
  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1', { exclude: ['/', '/health'] });

  // Retrieve the ConfigService to access configuration values
  const configService = app.get(ConfigService);

  // Start the application and listen on the configured port
  await app.listen(configService.get<string>('port'));
}

// Call the bootstrap function to start the application
bootstrap();
