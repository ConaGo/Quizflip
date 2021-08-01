import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isEmail } from 'class-validator';
import SocialSignupData from '../auth/dto/user.social.data';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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

    service = module.get(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
  describe('findAll', () => {
    const users = [
      {
        id: 2,
        email: 'mutoe@foxmail.com',
        name: 'mutoe',
        passwordHash: 'SDKASDI)IMA',
        isActive: true,
      },
      {
        id: 3,
        email: 'mutoe2@foxmail2.com',
        name: 'mutoe2',
        passwordHash: 'SDKASDI)IMA2',
        isActive: false,
      },
    ];
    it('should return all users', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);
      const userResult = await service.findAll();

      expect(userResult).toBe(users);
      expect(repository.find).toBeCalled();
    });
  });
  describe('findOneById', () => {
    it('should call findOne with the given id', async () => {
      const userId = 2;
      await service.findOneById(userId);
      expect(repository.findOne).toHaveBeenCalledWith(userId);
    });
  });
  describe('findOneNameOrEmail', () => {
    const user = {
      id: 2,
      email: 'mutoe@foxmail.com',
      name: 'mutoe',
      passwordHash: 'SDKASDI)IMA',
      isActive: true,
    };
    it('should find user correctly given a name', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);
      const userResult = await service.findOneNameOrEmail(user.name);

      expect(userResult).toBe(user);
      expect(repository.findOne).toBeCalledWith({
        name: user.name,
      });
    });
    it('should find user correctly given an email', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);
      const userResult = await service.findOneNameOrEmail(user.email);

      expect(userResult).toBe(user);
      expect(repository.findOne).toBeCalledWith({
        name: user.email,
      });
    });
  });
  describe('create', () => {
    it('should create user correctly', async function () {
      const user = {
        email: 'mutoe@foxmail.com',
        name: 'mutoe',
        password: '12345678',
      };
      await service.create(user);
      expect(repository.save).toHaveBeenCalled();
    });
  });
  describe('createSocial', () => {
    it('should call save with the given user', async () => {
      const socialUser: SocialSignupData = {
        name: 'hans',
        email: 'hans@hansi.de',
        authType: 'google',
        socialId: 'hsadkjsadk',
      };
      await service.createSocial(socialUser);
    });
  });
});
