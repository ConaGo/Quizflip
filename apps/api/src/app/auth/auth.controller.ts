import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Req,
  UseInterceptors,
  Redirect,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  //@ApiBearerAuth()
  //@UseGuards(LocalAuthGuard)
  @HttpCode(200) //nestjs default for POST is 201
  @Post('login')
  @ApiOperation({
    summary: 'Authentication with password and email/username',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        access_token: 'ey....',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: false }) res) {
    const user = await this.userService.findOneNameOrEmail(
      loginDto.nameOrEmail
    );
    console.log(user);
    const payload = { name: user.name, sub: user.id };
    const cookie = await this.authService.getJwtCookie(payload);
    console.log(cookie);
    await res.setHeader('Set-Cookie', cookie);
    return res.send(user);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Signup with password, email and username',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        access_token: 'ey....',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: ['name must be longer than or equal to 5 characters'],
        error: 'Bad Request',
      },
    },
  })
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.userService.create(signupDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    console.log('/github');
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res) {
    res.cookie(
      'jwt',
      JSON.stringify(
        await this.authService.socialLoginOrSignup('google', req.user)
      )
    );
    res.redirect('http://localhost:4200/authflow');
  }
  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(@Req() req) {
    console.log('/github');
  }

  @Get('github/redirect')
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: false }) res: Response
  ) {
    const user = await this.authService.socialLoginOrSignup('github', req.user);
    const payload = { name: user.name, sub: user.id };
    const cookie = await this.authService.getJwtCookie(payload);
    console.log(cookie);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.cookie('Authentication', cookie, {
      maxAge: 900000,
      httpOnly: true,
      path: '/',
      //domain: 'localhost:4200',
    });
    res.redirect('http://localhost:4200/authflow');
  }
}
