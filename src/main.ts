import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { UserConfigService } from '@core/config/user-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const userConfigService: UserConfigService = app.get(UserConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('User API Swagger')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(userConfigService.port);
  Logger.verbose(`Started port ${userConfigService.port}`, 'Bootstrap');
}
bootstrap();
