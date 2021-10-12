import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { factory, useSeeding } from 'typeorm-seeding';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { DeleteResult } from 'typeorm';

describe('UserService', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let usersMock, userMock;
  let userServiceMock: Partial<UserService>;
  beforeAll(async () => {
    await useSeeding({
      root: `${process.cwd()}/apps/api/src`,
      configName: 'ormconfig.js',
    });
    usersMock = await factory(User)({ authType: 'local' }).makeMany(10);
    userMock = usersMock[0];
    userServiceMock = {
      findAll: jest.fn(() => usersMock),
      findOneById: jest.fn((id) => (id === userMock.id ? userMock : null)),
      remove: jest.fn(async (id) =>
        id === userMock.id ? new DeleteResult() : null
      ),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UserService, useValue: userServiceMock },
        UserResolver,
      ],
    }).compile();
    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  describe('findAllUsers', () => {
    it('should call findAll and return all users', async () => {
      const result = await resolver.findAllUsers();
      expect(userService.findAll).toBeCalled();
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
