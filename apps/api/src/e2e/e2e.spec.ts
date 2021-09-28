import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';

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
});
