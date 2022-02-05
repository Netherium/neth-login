import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const SwaggerConfig = (configService: ConfigService, app: INestApplication) => {
  app.setGlobalPrefix('api');
  const host = configService.get<string>('HOST');
  const port = configService.get<string>('PORT');
  const apiPrefix = configService.get<string>('API_PREFIX');
  const config = new DocumentBuilder()
    .setTitle('Neth-login')
    .setDescription('The Neth-login API description')
    .setVersion('1.0')
    .addServer(`http://${host}:${port}`)
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT', scheme: 'bearer' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      layout: 'BaseLayout',
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Neth-login',
  };
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, customOptions);
};
