import * as Joi from 'joi';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { QuestionModule } from './question/question.module';

import { ormconfig } from './typeorm/ormconfig';

@Module({
  imports: [
    //Setup env variables validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        API_DOMAIN: Joi.string(),
        API_PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_MINUTES: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_MINUTES: Joi.number().required(),

        GOOGLE_ID: Joi.string().required(),
        GOOGLE_SECRET: Joi.string().required(),

        GITHUB_ID: Joi.string().required(),
        GITHUB_SECRET: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'apps/api/src/schema.gql'),
      include: [QuestionModule, UserModule],
    }),
    //for Postgres Database Connection
    //TODO-PRODUCTION for production set synchronize to false
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: ormconfig,
    }),
    AuthModule,
    UserModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
