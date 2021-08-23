import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import morganBody from 'morgan-body';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { LoggingInterceptor } from './logging.interceptor';
import { useRequestLogging } from './logging.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  //TODO-production: remove CORS
  app.enableCors({ credentials: true });
  //swagger setup
  const config = new DocumentBuilder()
    .setTitle('Learnit Digital API')
    .setDescription(
      'Description of the API Endpoints for the Learnit.Digital Web-App'
    )
    .setVersion('0.1.0')
    .addTag('Auth')
    .addTag('User')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  //logger setup
  //app.useGlobalInterceptors(new LoggingInterceptor());
  //useRequestLogging(app);
  app.use(morgan('tiny'));
  //morganBody(app);

  //app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  console.log(configService.get(''));
  await app.listen(configService.get('API_PORT'));
  //hot reload via npm run start:dev:hot
  //stripable
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().then(() =>
  console.log('Service listening 👍: ', process.env.API_PORT)
);
