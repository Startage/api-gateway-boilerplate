import { Public } from '@/common/guards/jwt-auth.guard';
import { ApplyResetPasswordDto } from '@/reset-password/dto/apply-reset-password.dto';
import { RequestResetPasswordDto } from '@/reset-password/dto/request-reset-password.dto';
import { ResetPasswordService } from '@/reset-password/reset-password.service';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reset-password')
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Public()
  @Post()
  async requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ) {
    await this.resetPasswordService.requestResetPassword(
      requestResetPasswordDto,
    );
    return 'Acesse seu email para alterar sua senha';
  }

  @Public()
  @Put('/:id')
  async applyResetPassword(
    @Body() applyResetPasswordDto: ApplyResetPasswordDto,
    @Param('id') id: string,
  ) {
    await this.resetPasswordService.applyResetPassword({
      id,
      ...applyResetPasswordDto,
    });
    return 'Senha alterada com sucesso';
  }
}
