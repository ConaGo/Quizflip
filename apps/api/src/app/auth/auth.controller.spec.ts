import { LoginDto, SignupDto } from '@libs/shared-types';
import {
  ClassSerializerInterceptor,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { User } from '../indexes/entity.index';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from '../validation.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as Faker from 'faker';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { doesNotReject } from 'node:assert';
import { send } from 'node:process';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
describe('AuthController', () => {
  let app: INestApplication;
  const signupUserMock: SignupDto = {
    email: Faker.internet.email(),
    name: Faker.internet.userName(),
    password: Faker.internet.password(),
  };
  const loginUserMock: LoginDto = {
    nameOrEmail: signupUserMock.email,
    password: signupUserMock.password,
  };
  const userEntityMock = {
    id: 2,
    email: signupUserMock.email,
    name: signupUserMock.name,
    passwordHash:
      '$argon2i$v=19$m=4096,t=3,p=1$g7im6iPtd5ElrS43uzTUHw$y08yzQmb76KiB9AxKExQBEN3k4ytzX4+qSE9WEMeIDQ',
    isActive: true,
  };
  const userServiceMock = {
    create: jest.fn(() => userEntityMock),
    findOneNameOrEmail: jest.fn((u) => {
      if (u === userEntityMock.email || u === userEntityMock.name) {
        return userEntityMock;
      } else {
        return null;
      }
    }),
    createSocial: jest.fn(() => userEntityMock),
    findSocial: jest.fn(),
    removeRefreshToken: jest.fn(),
  };
  const mockCookieOptions = {
    maxAge: 60,
    httpOnly: true,
    path: '/',
  };
  const mockRefreshCookieOptions = {
    maxAge: 6000,
    httpOnly: true,
    path: '/',
  };
  const authServiceMock = {
    validateUser: jest.fn(() => userEntityMock),
    signup: jest.fn(() => userEntityMock),
    login: jest.fn(() => userEntityMock),
    socialLoginOrSignup: jest.fn(() => userEntityMock),
    getJwtCookie: jest.fn(() => ['Authentication', 'token', mockCookieOptions]),
    getAndAddJwtRefreshCookie: jest.fn(() => [
      'Refresh',
      'token',
      mockRefreshCookieOptions,
    ]),
    getLogoutCookie: jest.fn((name) => [
      name,
      '',
      { maxAge: 0, httpOnly: true, path: '/' },
    ]),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ConfigService,
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        LocalStrategy,
        JwtStrategy,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .compile();
    app = module.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector))
    );
    await app.init();
  });

  it('should be defined', async () => {
    expect(app).toBeDefined();
  });
  describe('auth/login', () => {
    describe('when called with valid data', () => {
      it('find the user and correctly set auth cookies', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send(loginUserMock)
          .expect(200)
          .expect((res) => {
            expect(authServiceMock.getJwtCookie).toBeCalledWith(userEntityMock);
            expect(authServiceMock.getAndAddJwtRefreshCookie).toBeCalledWith(
              userEntityMock
            );
            expect(authServiceMock.validateUser).toBeCalledWith(
              loginUserMock.nameOrEmail,
              loginUserMock.password
            );
            expect(res.header['set-cookie'].length).toBe(2);
          });
      });
    });
    describe('when called with invalid data', () => {
      it('should respond with status code 401', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ wrongField: 'wrongValue' })
          .expect(401);
      });
    });
  });
  describe('/auth/signup', () => {
    describe('when called with valid data', () => {
      it('should call create on userservice', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupUserMock)
          .expect(201)
          .expect(() => {
            expect(userServiceMock.create).toBeCalled();
          });
      });
    });
  });
  describe('/auth/logout', () => {
    it('should set jwt and refresh cookie to null', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200)
        .expect((res) => {
          expect(res.header['set-cookie'].length).toBe(2);
          expect(userServiceMock.removeRefreshToken).toBeCalled();
          expect(res.body.passwordHash).not.toBeDefined();
          expect(console.log(res.body));
        });
    });
  });
});
