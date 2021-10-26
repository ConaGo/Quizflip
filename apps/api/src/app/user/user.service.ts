import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, FindOneOptions } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { RefreshTokenHash } from './entities/refreshTokenHash.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import SocialSignupData, { AuthType } from '../auth/dto/user.social.data';
import { ServerErrorException } from '../exceptions/serverError.exception';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    //private readonly refreshRepository: Repository<RefreshTokenHash>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findOneById(id: number, options?: FindOneOptions): Promise<User> {
    const user = await this.userRepository.findOne(id, options);
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
    const user = await this.findOneById(userId, {
      relations: ['refreshTokenHashes'],
    });
    const refreshTokenEntity = new RefreshTokenHash();
    refreshTokenEntity.tokenHash = await argon2.hash(refreshToken);
    user.refreshTokenHashes.push(refreshTokenEntity);
    await this.userRepository.save(user);
  }

  //checks if the given token is saved in the user object
  //also checks if tokens of the user are not expired and updates the hasharray on the user
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOneById(userId, {
      relations: ['refreshTokenHashes'],
    });
    const newHashes = [];
    let found = false;
    for (let i = user.refreshTokenHashes.length - 1; i >= 0; i--) {
      const token = user.refreshTokenHashes[i];
      if (!this.isTokenExpired(token.created)) {
        newHashes.push(token);
        if (await argon2.verify(token.tokenHash, refreshToken)) found = true;
      }
    }
    if (!found) return null;

    user.refreshTokenHashes = newHashes;
    return this.userRepository.save(user);
  }
  private isTokenExpired = (creationDate: Date) => {
    const now = new Date();
    return (
      now.getTime() - creationDate.getTime() >
      this.configService.get('JWT_REFRESH_EXPIRATION_MINUTES') * 1000 * 60
    );
  };
  async removeRefreshToken(refreshToken: string, userId: number) {
    const user = await this.findOneById(userId, {
      relations: ['refreshTokenHashes'],
    });
    if (!refreshToken) return;
    const newRefreshTokenHashes = await this.asyncFilter(
      user.refreshTokenHashes,
      async (hash) => {
        return !(await argon2.verify(hash.tokenHash, refreshToken));
      }
    );
    user.refreshTokenHashes = newRefreshTokenHashes;
    return this.userRepository.save(user);
  }
  private asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
  };
}
