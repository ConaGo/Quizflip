import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isEmail } from 'class-validator';
import SocialSignupData from '../auth/dto/user.social.data';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { SignupDto } from '@libs/shared-types';
import * as Faker from 'faker';
import { factory } from 'typeorm-seeding';
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  //let user, userDto: SignupDto, users;
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
  const user = users[0];
  const userDto = {
    email: user.email,
    name: user.name,
    password: Faker.internet.password(),
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
  describe('findAll', () => {
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
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);
      await service.findOneById(userId);
      expect(repository.findOne).toHaveBeenCalledWith(userId);
    });
  });
  describe('findOneNameOrEmail', () => {
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
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await service.create(userDto);
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
