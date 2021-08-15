import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../legacy/question/dto/create-question.dto';
import { UpdateQuestionDto } from '../legacy/question/dto/update-question.dto';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>
  ) {}
  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    return this.questionRepository.save(createQuestionInput);
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
