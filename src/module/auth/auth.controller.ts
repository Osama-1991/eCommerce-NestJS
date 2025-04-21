import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  CheckEmailDto,
  confirmEmailDto,
  CreateUserDto,
  LoginDto,
  refreshTokenDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterCloudOption, fileFormat } from 'src/common/z_index';
import { IToken } from 'src/DB/z_index';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @UseInterceptors(
    FileInterceptor(
      'image',
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Post('signUp')
  async signUp(
    @Body() body: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.signUp(body, image);
  }

  @Patch('confirm-email')
  async confirmEmail(
    @Body() body: confirmEmailDto,
  ): Promise<{ message: string }> {
    return this.userService.confirmEmail(body);
  }

  @Patch('send-Otp-Confirm-Email')
  async sendOtpConfirmEmail(
    @Body() body: { email: string },
  ): Promise<{ message: string }> {
    return this.userService.sendOtpConfirmEmail(body);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto): Promise<{
    message: string;
    data: { token: IToken };
  }> {
    return this.userService.login(body);
  }

  @Post('forget-password')
  async forgetPassword(@Body() body: CheckEmailDto) {
    return this.userService.forgetPassword(body);
  }

  @Patch('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.userService.resetPassword(body);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: refreshTokenDto) {
    return this.userService.refreshToken(body);
  }
}
