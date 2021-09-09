import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { factory } from 'typeorm-seeding';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import * as f from '@libs/data-access';
import { DeleteResult } from 'typeorm';
describe('UserService', () => {
  let resolver: UserResolver;
  let userService: UserService;
  const usersMock = factory(User)().createMany(10);
  const userMock = usersMock[0];
  const userServiceMock: Partial<UserService> = {
    findAll: () => usersMock,
    findOneById: (id) => (id === userMock.id ? userMock : null),
    remove: async (id) => (id === userMock.id ? new DeleteResult() : null),
  };
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();
    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });
  describe('findAllUsers', () => {
    it('should call findAll and return all users', async () => {
      const result = await resolver.findAllUsers();
      expect(userServiceMock.findAll).toBeCalled();
      expect(result).toEqual(usersMock);
    });
  });

  describe('findUserById', () => {
    it('should call findOneById and return all users', async () => {
      const result = await resolver.findUserById(userMock.id);
      expect(userServiceMock.findOneById).toBeCalled();
      expect(result).toEqual(userMock);
    });
  });
  describe('removeUserById', () => {
    it('should call remove and return a string containing user id and result', async () => {
      const result = await resolver.removeUserById(userMock.id);
      expect(userService.remove).toHaveBeenCalled();
      expect(result.includes(String(userMock.id))).toEqual(true);
      expect(result.includes('result')).toEqual(true);
    });
  });
  describe('removeUserByEmail', () => {
    it('should call remove and return a string containing user id and result', async () => {
      const result = await resolver.removeUserById(userMock.id);
      expect(userService.remove).toHaveBeenCalled();
      expect(result.includes(String(userMock.id))).toEqual(true);
      expect(result.includes('result')).toEqual(true);
    });
  });
});
