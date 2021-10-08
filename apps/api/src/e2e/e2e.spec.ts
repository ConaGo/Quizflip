import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import * as request from 'supertest';

describe('e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    console.log(process.env.DB_NAME);
  });
  it('should be defined', async () => {
    expect(app).toBeDefined();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: ['someDaat'],
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
