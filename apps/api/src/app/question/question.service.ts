import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';
import { difference } from 'lodash';
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

    //Throws if user is not found
    await this.userService.findOneById(authorId);
    const question = await this.questionRepository.save(rest);
    await this.questionRepository
      .createQueryBuilder()
      .relation(Question, 'author')
      .of(question.id)
      .set(authorId);
    return question;
  }
  async createMany(
    createQuestionInput: CreateQuestionInput[]
  ): Promise<Question[]> {
    //TODO extract userid from request
    const { authorId } = createQuestionInput[0];

    //Throws if user is not found
    await this.userService.findOneById(authorId);

    //Save Questions
    const questionArray = createQuestionInput.map((element) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { authorId, ...rest } = element;
      return rest;
    });
    const questions = await this.questionRepository.save(questionArray);
    console.log(questions);
    //Add Author-Relation
    createQuestionInput.forEach(async (element, i) => {
      await this.questionRepository
        .createQueryBuilder()
        .relation(Question, 'author')
        .of(questions[i].id)
        .set(authorId);
    });
    return questions;
  }

  findAll() {
    return this.questionRepository.find();
  }

  async check(id: number, answers: string[]): Promise<boolean> {
    const question = await this.questionRepository.findOne(id);
    if (!question) throw new NotFoundException();
    const sameLength = question.correctAnswers.length === answers.length;
    const sameAnswers =
      difference(answers, question.correctAnswers).length === 0;
    return sameLength && sameAnswers;
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
    //Documentation on performantly getting a truly random batch
    //https://www.2ndquadrant.com/en/blog/tablesample-and-other-methods-for-getting-random-tuples/
    count = count > 0 && count <= 100 && typeof count === 'number' ? count : 10;
    //TODO automate database setup
    /* await this.questionRepository.query(
      'CREATE EXTENSION tsm_system_rows'
    ); */
    const res = await this.questionRepository.query(
      `SELECT * FROM question TABLESAMPLE SYSTEM_ROWS($1)`,
      [count]
    );
    console.log(res);
    return res;
  }

  async getFreshRandomBatch(count: number, id: number): Promise<Question[]> {
    count = count > 0 && count <= 100 && typeof count === 'number' ? count : 10;
    await this.questionRepository.query('CREATE EXTENSION system_rows');
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
