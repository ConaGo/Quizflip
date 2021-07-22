import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserIdFromJwt } from '../decorators/getUserIdFromJwt';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@GetUserIdFromJwt() userId: number) {
    return this.userService.findCurrentUser(userId);
  }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Delete()
  deleteUser(@Query('email') email: string) {
    console.log(email);
    return this.userService.deleteOne(email);
  }
}
