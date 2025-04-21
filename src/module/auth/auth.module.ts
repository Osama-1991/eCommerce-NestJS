import { Module } from '@nestjs/common';
import { userModel, otpModel } from 'src/DB/model/z_index';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailListener } from 'src/common/email/event/listeners/email.listeners';
import { OtpRepositoryService } from 'src/DB/z_index';

@Module({
  imports: [userModel, otpModel],
  controllers: [AuthController],
  providers: [AuthService, EmailListener, OtpRepositoryService],
})
export class AuthModule {}
