import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Question } from './entities/question.entity';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';

describe('QuestionResolver', () => {
  let resolver: QuestionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      /*  imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: `${60 * configService.get('JWT_EXPIRATION_MINUTES')}s`,
            },
          }),
        }),
      ], */
      providers: [
        ConfigService,
        QuestionResolver,
        QuestionService,
        UserService,
        {
          provide: getRepositoryToken(Question),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            metadata: {
              propertiesMap: {},
            },
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            metadata: {
              propertiesMap: {},
            },
          },
        },
      ],
    }).compile();

    resolver = module.get<QuestionResolver>(QuestionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
