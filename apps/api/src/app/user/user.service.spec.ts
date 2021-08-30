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
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from '../app.module';
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  //let userService: UserService;
  //let user, userDto: SignupDto, users;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      /*       imports: [
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
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
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
      email: Faker.internet.email(),
      name: Faker.internet.userName(),
      passwordHash: 'SDKASDI)IMA',
      isActive: true,
    },
    {
      id: 3,
      email: Faker.internet.email(),
      name: Faker.internet.userName(),
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
  const socialUser: SocialSignupData = {
    name: Faker.internet.userName(),
    email: Faker.internet.email(),
    authType: 'google',
    socialId: 'hsadkjsadk',
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
      await service.createSocial(socialUser);
      expect(repository.save).toHaveBeenCalled();
    });
  });
  describe('findSocial', function () {
    it('should call findOne with socialId and authType', async function () {
      await service.findSocial(socialUser.authType, socialUser.socialId);
      expect(repository.findOne).toHaveBeenCalledWith({
        socialId: socialUser.socialId,
        authType: socialUser.authType,
      });
    });
  });
  describe('removeOneByEmail', function () {
    it('should not call remove and throw if it finds no user', async function () {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      expect(
        async () => await service.removeOneByEmail(user.email)
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND)
      );
      expect(repository.remove).toBeCalledTimes(0);
    });
    it('should call findOne with the email', async function () {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);
      await service.removeOneByEmail(user.email);
      expect(repository.findOne).toBeCalledWith({ email: user.email });
    });
    it('should call remove if it finds the user', async function () {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue({ name: 'hans', email: 'hans@hansi.de' } as User);
      await service.removeOneByEmail(user.email);
      expect(repository.remove).toBeCalled();
    });
  });
});
