import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
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
    //TODO extract userid from request
    const { authorId, ...rest } = createQuestionInput;
    const user = await this.userService.findOneById(authorId);
    const question = await this.questionRepository.save(rest);
    await this.questionRepository
      .createQueryBuilder()
      .relation(Question, 'author')
      .of(question.id)
      .set(authorId);
    return question;
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

  async removeAll() {
    const questions = await this.questionRepository.find();
    questions.forEach((q) => {
      this.remove(q.id);
    });
    return `done deleting ${questions.length} questions`;
  }
  async getRandomBatch(count: number): Promise<Question[]> {
    count = count > 0 && count <= 100 && typeof count === 'number' ? count : 10;
    return this.questionRepository.query(
      `SELECT * FROM question TABLESAMPLE BERNOULLI(${count})`
    );
  }

  getFreshRandomBatch(count: number, id: number): Promise<Question[]> {
    count = count > 0 && count <= 100 && typeof count === 'number' ? count : 10;
    return this.questionRepository.query(
      'SELECT * FROM question WHERE id =! :id TABLESAMPLE BERNOULLI(:count)',
      [count, id]
    );
  }

  async findAllCategories(): Promise<string[]> {
    const res = await this.questionRepository.query(
      'SELECT array_agg(DISTINCT category) FROM question'
    );
    console.log(res);
    return res[0].array_agg;
  }
}
