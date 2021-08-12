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
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionRepository.save(createQuestionDto);
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

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.findOne(id);
    if (!question) throw new NotFoundException();
    return this.questionRepository.update(id, updateQuestionDto);
  }

  remove(id: number) {
    return this.questionRepository.delete(id);
  }
}
