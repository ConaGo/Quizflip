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
} from '@nestjs/common';
import { AuthService } from './auth.service';
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
  constructor(private readonly authService: AuthService) {}

  //@ApiBearerAuth()
  //@UseGuards(LocalAuthGuard)
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
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
    return this.authService.signup(signupDto);
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
  async githubAuthRedirect(@Req() req, @Res({ passthrough: true }) res) {
    console.log(req.user);
    //setting jwt in "one time cookie" to be able to read it in the frontend
    //after a redirect.
    //TODO-Production set cookie to secure so it only gets sent over https connections
    res.cookie(
      'jwt',
      JSON.stringify(
        await this.authService.socialLoginOrSignup('github', req.user)
      )
    );
    res.redirect('http://localhost:4200/authflow');
  }
}
