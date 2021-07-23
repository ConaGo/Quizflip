import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import SocialSignupData, { AuthType } from '../auth/dto/user.social.data';
import { ServerErrorException } from '../exceptions/serverError.exception';
import { PostgresErrorCode } from 'pg';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findCurrentUser(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
  async findOneNameOrEmail(nameOrEmail: string): Promise<User> {
    let r;
    let user = await this.userRepository.findOne({ name: nameOrEmail });
    if (!user) {
      user = await this.userRepository.findOne({ email: nameOrEmail });
    }
    if (!user) {
      throw new HttpException(
        'User with that name already exists',
        HttpStatus.BAD_REQUEST
      );
    }
    return r;
  }
  async remove(id: string): Promise<DeleteResult> {
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
      console.log({
        email: signupDto.email,
        name: signupDto.name,
        passwordHash: passwordHash,
      });
      return this.userRepository.save({
        email: signupDto.email,
        name: signupDto.name,
        passwordHash: passwordHash,
      });
    } catch (err) {
      console.log(err);
      throw new ServerErrorException(err);
    }
  }
  async createSocial(socialSignupData: SocialSignupData): Promise<User> {
    try {
      return this.userRepository.save({
        ...socialSignupData,
      });
    } catch (err) {
      console.log(err);
      throw new ServerErrorException(err);
    }
  }
  async findSocial(authType: AuthType, socialId: string): Promise<User> {
    return this.userRepository.findOne({
      socialId: socialId,
      authType: authType,
    });
  }
  async deleteOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    if (user) {
      return this.userRepository.remove(user);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
