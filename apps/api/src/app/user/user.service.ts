import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import SocialSignupData from '../auth/dto/user.social.data';
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
    await this.userRepository
      .findOne({ name: nameOrEmail })
      .then((v) => (r = v));
    await this.userRepository
      .findOne({ email: nameOrEmail })
      .then((v) => (r = v));
    return r;
  }
  async remove(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
  async create(signupDto: SignupDto): Promise<User> {
    try {
      const passwordHash = await argon2.hash(signupDto.password);
      return this.userRepository.save({
        email: signupDto.email,
        name: signupDto.name,
        passwordHash: passwordHash,
      });
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST
        );
      }
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
}
