import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Question } from './entities/question.entity';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        UserService,
        QuestionResolver,
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

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getQuestionStats', () => {
    it('should return stats', () => {
      //expect();
    });
  });
});
