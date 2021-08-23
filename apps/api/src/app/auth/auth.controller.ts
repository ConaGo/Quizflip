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
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import ReqWithUser from './reqWithUser.interface';
import JwtRefreshGuard from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { JoiValidationPipe } from '../validation.pipe';
import { loginFormData, signupFormData } from '@libs/shared-types';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @UsePipes(new JoiValidationPipe(loginFormData))
  @UseGuards(LocalAuthGuard)
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
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    //res.setHeader('Access-Control-Allow-Credentials', true);
    const user = await this.userService.findOneNameOrEmail(
      loginDto.nameOrEmail
    );
    //Set jwt
    res.cookie(...(await this.authService.getJwtCookie(user)));
    //Set RefreshToken and add it the User
    res.cookie(...(await this.authService.getAndAddJwtRefreshCookie(user)));
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(
    @Req() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.userService.removeRefreshToken(req?.cookies?.Refresh, req.user);
    res.cookie(...(await this.authService.getLogoutCookie('Refresh')));
    res.cookie(...(await this.authService.getLogoutCookie('Authentication')));
  }

  @UsePipes(new JoiValidationPipe(signupFormData))
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
    return this.userService.create(signupDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    console.log('/github');
  }
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    //res.setHeader('Access-Control-Allow-Credentials', true);
    const user = await this.authService.socialLoginOrSignup('google', req.user);
    //Set jwt
    res.cookie(...(await this.authService.getJwtCookie(user)));
    //Set RefreshToken and add it the User
    res.cookie(...(await this.authService.getAndAddJwtRefreshCookie(user)));
    res.redirect('http://localhost:4200/me');
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(@Req() req) {
    console.log('/github');
  }
  @Get('github/redirect')
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(
    @Req() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    //res.setHeader('Access-Control-Allow-Credentials', true);
    const user = await this.authService.socialLoginOrSignup('github', req.user);
    //Set jwt
    res.cookie(...(await this.authService.getJwtCookie(user)));
    //Set RefreshToken and add it the User
    res.cookie(...(await this.authService.getAndAddJwtRefreshCookie(user)));
    res.redirect('http://localhost:4200/me');
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    res.cookie(...(await this.authService.getJwtCookie(req.user)));
    res.cookie(...(await this.authService.getAndAddJwtRefreshCookie(req.user)));
    return req.user;
  }
}
