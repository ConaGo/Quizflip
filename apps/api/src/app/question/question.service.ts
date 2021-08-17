import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly userService: UserService
  ) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const { userId, ...rest } = createQuestionInput;
    const author = await this.userService.findOneById(userId);
    const question = { author, ...rest };
    return this.questionRepository.save(question);
  }

  findAll() {
    return this.questionRepository.find();
  }

  async check(id: number, answer: string): Promise<boolean> {
    const question = await this.questionRepository.findOne(id);
    if (!question) throw new NotFoundException();
    else {
      return question.correctAnswer === answer;
    }
  }
  findOne(id: number) {
    return this.questionRepository.findOne(id);
  }

  async update(id: number, updateQuestionInput: UpdateQuestionInput) {
    const question = await this.questionRepository.findOne(id);
    if (!question) throw new NotFoundException();
    return this.questionRepository.update(id, updateQuestionInput);
  }

  remove(id: number) {
    return this.questionRepository.delete(id);
  }

  async getRandomBatch(count: number): Promise<Question[]> {
    count = count > 0 && count <= 100 && typeof count === 'number' ? count : 10;
    return this.questionRepository.query(
      `SELECT * FROM user TABLESAMPLE BERNOULLI(${count})`
    );
  }

  getFreshRandomBatch(count: number, id: number): Promise<Question[]> {
    count = count > 0 && count <= 100 && typeof count === 'number' ? count : 10;
    return this.questionRepository.query(
      `SELECT * FROM user WHERE id =! :id TABLESAMPLE BERNOULLI(:count)`,
      [count, id]
    );
  }
}
