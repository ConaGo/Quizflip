import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import SocialSignupData, { AuthType } from '../auth/dto/user.social.data';
import { ServerErrorException } from '../exceptions/serverError.exception';
import { PostgresErrorCode } from 'pg';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  async findOneNameOrEmail(nameOrEmail: string): Promise<User> {
    let user = await this.userRepository.findOne({ name: nameOrEmail });
    if (!user) {
      user = await this.userRepository.findOne({ email: nameOrEmail });
    }
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
  async create(signupDto: SignupDto): Promise<User> {
    let user = await this.userRepository.findOne({ name: signupDto.name });
    if (user) {
      throw new HttpException(
        'User with that name already exists',
        HttpStatus.BAD_REQUEST
      );
    }
    user = await this.userRepository.findOne({ email: signupDto.email });
    if (user) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const passwordHash = await argon2.hash(signupDto.password);
      return this.userRepository.save({
        email: signupDto.email,
        name: signupDto.name,
        passwordHash: passwordHash,
      });
    } catch (err) {
      throw new ServerErrorException(err);
    }
  }
  async createSocial(socialSignupData: SocialSignupData): Promise<User> {
    try {
      return this.userRepository.save({
        ...socialSignupData,
      });
    } catch (err) {
      throw new ServerErrorException(err);
    }
  }
  async findSocial(authType: AuthType, socialId: string): Promise<User> {
    return this.userRepository.findOne({
      socialId: socialId,
      authType: authType,
    });
  }
  async removeOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    if (user) {
      return this.userRepository.remove(user);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  async addRefreshToken(refreshToken: string, userId: number) {
    const user = await this.findOneById(userId);
    const date = new Date();
    //concat with date to save expiration time
    const newRefreshToken = (await argon2.hash(refreshToken)) + date.toString();
    await this.userRepository.update(userId, {
      refreshTokenHashes: [...user.refreshTokenHashes, newRefreshToken],
    });
  }

  //checks if the given token is saved in the user object
  //also checks if tokens of the user are not expired and updates the hasharray on the user
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOneById(userId);
    const newHashes = [];
    let returnValue = null;
    for (let i = user.refreshTokenHashes.length - 1; i >= 0; i--) {
      const token = user.refreshTokenHashes[i];
      if (!this.isTokenExpired(token)) {
        newHashes.push(token);
        if (await argon2.verify(token, refreshToken)) returnValue = user;
      }
    }
    await this.userRepository.update(user, { refreshTokenHashes: newHashes });
    return returnValue;
  }
  private isTokenExpired = (token: string) => {
    const hash = token.substring(0, argon2.defaults.hashLength);
    const date = Date.parse(token.substring(argon2.defaults.hashLength));
    const now = new Date();
    console.log(hash, date);
    return (
      now.getTime() - date >
      this.configService.get('JWT_REFRESH_EXPIRATION_MINUTES') * 1000 * 60
    );
  };
  async removeRefreshToken(refreshToken: string, user: User) {
    const oldRefreshToken = await argon2.hash(refreshToken);
    const newRefreshTokenHashes = user.refreshTokenHashes.filter(
      (hash) => hash !== oldRefreshToken
    );
    return this.userRepository.update(user.id, {
      refreshTokenHashes: newRefreshTokenHashes,
    });
  }
}
