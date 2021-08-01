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
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserIdFromJwt } from '../decorators/getUserIdFromJwt';
import { UserService } from './user.service';
import { Request, Response } from 'express';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(
    @Req() req: Request
    //@Res({ passthrough: true }) res: Response
  ) {
    //res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('HJ');
    const d = (await this.jwtService.decode(req.cookies.Authentication)) as {
      [key: string]: any;
    };
    console.log(req?.cookies?.Authentication);
    console.log(d.name);
    let user;
    if (d.name) user = await this.userService.findOneNameOrEmail(d.name);
    //res.write(JSON.stringify(user));
    return user;
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
