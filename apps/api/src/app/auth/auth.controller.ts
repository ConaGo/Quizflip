import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Req,
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
import { SignupDto } from './dto/signup.dto';
import {
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import ReqWithUser from './reqWithUser.interface';
import JwtRefreshGuard from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { JoiValidationPipe } from '../validation.pipe';
import { loginFormData, signupFormData } from '@libs/shared-types';
import { User } from '../indexes/entity.index';
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
  @ApiUnauthorizedResponse({
    description: 'No user with that combination found',
  })
  async login(@Req() req: ReqWithUser, @Res({ passthrough: true }) res) {
    const user = await this.userService.findOneNameOrEmail(
      req.body.nameOrEmail
    );
    //Set jwt
    res.cookie(...(await this.authService.getJwtCookie(user)));
    //Set RefreshToken and add it the User
    res.cookie(...(await this.authService.getAndAddJwtRefreshCookie(user)));
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(
    @Req() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.userService.removeRefreshToken(
      req?.cookies?.Refresh,
      req.user?.id
    );
    // set empty cookies
    res.cookie(...(await this.authService.getLogoutCookie('Refresh')));
    res.cookie(...(await this.authService.getLogoutCookie('Authentication')));
  }

  @UsePipes(new JoiValidationPipe(signupFormData))
  @Post('signup')
  @ApiOperation({
    summary: 'Signup with password, email and username',
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
    return new User(user);
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
    const user = await this.authService.socialLoginOrSignup('google', req.user);
    //Set jwt
    res.cookie(...(await this.authService.getJwtCookie(user)));
    //Set RefreshToken and add it the User
    res.cookie(...(await this.authService.getAndAddJwtRefreshCookie(user)));
    res.redirect(
      `http://localhost:4200/authflow/?user=${JSON.stringify(user)}`
    );
    //return user;
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

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
    res.redirect('http://localhost:4200/');
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.userService.removeRefreshToken(
      req?.cookies?.Refresh,
      req.user?.id
    );
    res.cookie(...(await this.authService.getJwtCookie(req.user)));
    res.cookie(...(await this.authService.getAndAddJwtRefreshCookie(req.user)));
    return req.user;
  }
}
//$argon2i$v=19$m=4096,t=3,p=1$S52hd0DuqcpRCLCJ46IdGw$BxVUL81U6uYZuoK4z5Q2lZNqzVN8BsKaJlV9o9/CJcs
