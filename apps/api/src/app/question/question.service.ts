import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import {Question} from './entities/question.entity'
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly userRepository: Repository<Question>
  ) {}
  create(createQuestionDto: CreateQuestionDto): Promise<Question>{
    return this.userRepository.save(createQuestionDto)
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
