import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { LoggingInterceptor } from './logging.interceptor';
import { useRequestLogging } from './logging.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, access-control-allow-origin',
      credentials: true,
      origin: 'http://localhost:4200',
      preflightContinue: false,
    },
  });

  //TODO-production: adjust limit
  app.use(json({ limit: '50mb' }));

  //swagger setup
  /*   const config = new DocumentBuilder()
    .setTitle('Learnit Digital API')
    .setDescription(
      'Description of the API Endpoints for the Learnit.Digital Web-App'
    )
    .setVersion('0.1.0')
    .addTag('Auth')
    .addTag('User')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); */

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  //logger setup
  //useRequestLogging(app);
  app.use(morgan('tiny'));
  //morganBody(app);

  //app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('API_PORT'));
}
bootstrap().then(() =>
  console.log('Service listening 👍: ', process.env.API_PORT)
);
