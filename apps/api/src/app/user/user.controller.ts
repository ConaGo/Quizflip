import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import ReqWithUser from '../auth/reqWithUser.interface';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: ReqWithUser) {
    return req.user;
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
