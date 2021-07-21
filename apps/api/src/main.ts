import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import morganBody from 'morgan-body';
import { AppModule } from './app/app.module';
import { LoggingInterceptor } from './logging.interceptor';
import { useRequestLogging } from './logging.middleware';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //TODO-production: remove CORS
  app.enableCors();
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

  //logger setup
  app.useGlobalInterceptors(new LoggingInterceptor());
  useRequestLogging(app);
  //app.use(morgan('tiny'));
  //morganBody(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
  //hot reload via npm run start:dev:hot
  //stripable
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().then(() => console.log('Service listening 👍: ', process.env.PORT));
