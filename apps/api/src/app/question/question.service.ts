import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';
import { difference } from 'lodash';
import { UserToQuestionStats } from './entities/userToQuestionStats.entity';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    //private readonly userRepo: Repository<User>,
    //private readonly questionStatsRepo: Repository<UserToQuestionStats>,
    private readonly userService: UserService
  ) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    //TODO extract userid from request
    const { authorId, ...rest } = createQuestionInput;

    //Throws if user is not found
    await this.userService.findOneById(authorId);
    const question = await this.questionRepo.save(rest);
    await this.questionRepo
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
    const questions = await this.questionRepo.save(questionArray);
    console.log(questions);
    //Add Author-Relation
    createQuestionInput.forEach(async (element, i) => {
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'author')
        .of(questions[i].id)
        .set(authorId);
    });
    return questions;
  }

  findAll(): Promise<Question[]> {
    return this.questionRepo.find();
  }

  async check(id: number, answers: string[]): Promise<boolean> {
    const question = await this.questionRepo.findOne(id);
    if (!question) throw new NotFoundException();
    const sameLength = question.correctAnswers.length === answers.length;
    const sameAnswers =
      difference(answers, question.correctAnswers).length === 0;
    return sameLength && sameAnswers;
  }
  async findOne(id: number): Promise<Question> {
    console.log(await this.questionRepo.findOne(id));
    return this.questionRepo.findOne(id);
  }

  async update(id: number, updateQuestionInput: UpdateQuestionInput) {
    const question = await this.questionRepo.findOne(id);
    if (!question) throw new NotFoundException();
    return this.questionRepo.update(id, updateQuestionInput);
  }

  remove(id: number) {
    return this.questionRepo.delete(id);
  }

  async removeAll() {
    const questions = await this.questionRepo.find();
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
    /* await this.questionRepo.query(
      'CREATE EXTENSION tsm_system_rows'
    ); */
    return this.questionRepo.query(
      `SELECT * FROM question TABLESAMPLE SYSTEM_ROWS($1)`,
      [count]
    );
  }

  async getFreshRandomBatch(count: number, id: number): Promise<Question[]> {
    count = count > 0 && count <= 100 && typeof count === 'number' ? count : 10;
    //await this.questionRepo.query('CREATE EXTENSION system_rows');
    return this.questionRepo.query(
      'SELECT * FROM question WHERE id =! :id TABLESAMPLE BERNOULLI(:count)',
      [count, id]
    );
  }

  async findAllCategories(): Promise<string[]> {
    const res = await this.questionRepo.query(
      'SELECT array_agg(DISTINCT category) FROM question'
    );
    console.log(res);
    return res[0].array_agg;
  }

  async getQuestionStats(userId: number): Promise<any> {
    //const user = await this.userRepo.findOne(userId);
    /* const stats = await this.questionStatsRepo.find({ userId: userId });
    console.log(stats); */
    this.questionRepo.query('SELECT category ');
  }
}
