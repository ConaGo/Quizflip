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
import { GithubStrategy } from './strategies/github.strategy';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh-auth.guard';
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy';
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
  const userEntityMock: Partial<User> = {
    email: signupUserMock.email,
    name: signupUserMock.name,
    passwordHash:
      '$argon2i$v=19$m=4096,t=3,p=1$Qj2I8ZlroJrXu0mUBILEPg$HeByu5rPLh6qWGcJ2h9nMWkZv9fjqghCJJW5fUKjyA8',
    deleted: null,
    id: 1,
    created: new Date(),
    updated: new Date(),
    refreshTokenHashes: [],
    isActive: true,
    authType: 'local',
    socialId: '',
    role: 'user',
  };
  const userServiceMock = {
    create: jest.fn(() => new User(userEntityMock)),
    findOneNameOrEmail: jest.fn(() => new User(userEntityMock)),
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
    const guardMock = { canActivae: () => true };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ConfigService,
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        LocalStrategy,
        JwtStrategy,
        GithubStrategy,
        GoogleStrategy,
        JwtRefreshStrategy,
      ],
    })
      .overrideGuard(JwtRefreshGuard)
      .useValue(guardMock)
      .overrideGuard(GoogleAuthGuard)
      .useValue(guardMock)
      .overrideGuard(GithubAuthGuard)
      .useValue(guardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(guardMock)
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
      it('find the user and correctly set auth cookies and return user without excluded fields', () => {
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
            const { name, email, id, role } = userEntityMock;
            expect(res.body).toEqual({ name, email, id, role });
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
      it('should call create on userservice, set auth cookies and return user without excluded fields', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupUserMock)
          .expect(201)
          .expect((res) => {
            const { name, email, id, role } = userEntityMock;
            expect(res.body).toEqual({ name, email, id, role });
            expect(userServiceMock.create).toBeCalled();
          });
      });
      describe('when called with invalid data', () => {
        it('should respond with status code 400', () => {
          return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ wrongField: 'wrongValue' })
            .expect(400);
        });
      });
    });
  });
  describe('/auth/logout', () => {
    it('should set jwt and refresh cookie to null and return nothing', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200)
        .expect((res) => {
          expect(res.header['set-cookie'].length).toBe(2);
          expect(userServiceMock.removeRefreshToken).toBeCalled();
          expect(res.body).toEqual({});
        });
    });
  });
  describe('/auth/github', () => {
    describe('when redirected from github', () => {
      it('should call socialLoginOrSignup, set auth cookies and redirect header', () => {
        return request(app.getHttpServer())
          .get('/auth/github/redirect')
          .expect((res) => {
            expect(res.header['location']).toBeDefined;
            expect(res.header['set-cookie'].length).toBe(2);
            expect(authServiceMock.socialLoginOrSignup).toBeCalled();
          });
      });
    });
  });
  describe('/auth/google', () => {
    describe('when redirected from google', () => {
      /*       const googleUserMock = {
        id: userEntityMock.id,
        emails: [{ value: userEntityMock.email }],
        name: { givenName: userEntityMock.name },
        photos: [{ value: 'path/to/picture' }],
      }; */
      it('should call socialLoginOrSignup, set auth cookies and redirect header', () => {
        return request(app.getHttpServer())
          .get('/auth/google/redirect')
          .expect((res) => {
            expect(res.header['location']).toBeDefined;
            expect(res.header['set-cookie'].length).toBe(2);
            expect(authServiceMock.socialLoginOrSignup).toBeCalled();
          });
      });
    });
  });
  describe('/auth/refresh', () => {
    it('should call removeRefreshToken and set new auth cookies', () => {
      return request(app.getHttpServer())
        .get('/auth/refresh')
        .expect((res) => {
          expect(userServiceMock.removeRefreshToken).toBeCalled();
          expect(res.header['set-cookie'].length).toBe(2);
        });
    });
  });
});
