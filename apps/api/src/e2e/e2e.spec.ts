import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import * as request from 'supertest';
import * as Faker from 'faker';
import { SignupDto } from '@libs/shared-types';
import { Connection } from 'typeorm';
import {
  factory,
  runSeeder,
  useRefreshDatabase,
  useSeeding,
} from 'typeorm-seeding';
import { User } from '../app/indexes/entity.index';
import CreateUserSeed from '../app/user/entities/user.entity.seed';
import { ormconfig } from '../ormconfig';
import { Reflector } from '@nestjs/core';
describe('e2e', () => {
  let app: INestApplication;
  let user;
  let createdUser;
  beforeAll(async () => {
    jest.setTimeout(20000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector))
    );
    await app.init();

    //clean database
    const connection = app.get(Connection);
    await connection.synchronize(true);

    await useSeeding({
      root: `${process.cwd()}/apps/api/src`,
      configName: 'ormconfig.js',
    });

    user = await factory(User)({ authType: 'local' }).make();
    createdUser = await factory(User)({ authType: 'local' }).create();
  });
  it('should be defined', async () => {
    expect(app).toBeDefined();
  });

  const userFormData: SignupDto = {
    email: Faker.internet.email(),
    name: Faker.internet.userName(),
    password: Faker.internet.password(),
  };

  it(`/GET user`, () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .expect([
        {
          id: 1,
          email: createdUser.email,
          name: createdUser.name,
          role: 'user',
        },
      ]);
  });
  it(`/POST signup`, () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(userFormData)
      .expect(201)
      .expect({
        id: 2,
        email: userFormData.email,
        name: userFormData.name,
        role: 'user',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
