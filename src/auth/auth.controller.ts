import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { ResendConfirmEmailDto } from '@/auth/dto/resend-confirm-email.dto';
import { SignupDto } from '@/auth/dto/signup.dto';
import { ValidationPendingConfirmEmailPipe } from '@/auth/pipes/validation-pending-confirm-email.pipe';
import { ValidationUserEmailPipe } from '@/auth/pipes/validation-user-email.pipe';
import { ApiBearerAuthJwt } from '@/common/decorators/api-bearer-auth-jwt';
import { Public } from '@/common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Put,
  Param,
  ForbiddenException,
  NotAcceptableException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  async login(@Request() req) {
    const auth = await this.authService.login(req.user);
    return auth;
  }

  @Public()
  @Post('signup')
  async signup(@Body(ValidationUserEmailPipe) signupDto: SignupDto) {
    await this.authService.signup(signupDto);
    return 'Usuário cadastrado com sucesso';
  }

  @Public()
  @Put('refresh-token/:refreshTokenId')
  async refreshToken(@Param('refreshTokenId') refreshTokenId: string) {
    const refreshed = await this.authService.refreshToken({
      refreshTokenId,
    });
    if (!refreshed) throw new ForbiddenException();
    return refreshed;
  }

  @Public()
  @Post('signup/resend-confirm-email')
  async resendSignupConfirmEmail(
    @Body(ValidationPendingConfirmEmailPipe)
    resendConfirmEmailDto: ResendConfirmEmailDto,
  ) {
    await this.authService.resendSignupConfirmEmail(resendConfirmEmailDto);
    return 'Email enviado com sucesso';
  }

  @Public()
  @Put('signup/confirm-email/:confirmToken')
  async signupConfirmEmail(@Param('confirmToken') confirmToken: string) {
    try {
      await this.authService.signupConfirmEmail({ confirmToken });
      return 'Email confirmado com sucesso';
    } catch (_) {
      throw new NotAcceptableException();
    }
  }

  @Get('profile')
  @ApiBearerAuthJwt()
  getProfile(@Request() req) {
    return req.user;
  }
}
