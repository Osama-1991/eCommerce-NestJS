import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailEvent } from '../events/email.event';
import { sendEmail } from '../../send.email';
import { emailTemplate } from '../../template.email';
import { CodeGenerator } from 'src/common/z_index';
import { OtpRepositoryService } from 'src/DB/z_index';

@Injectable()
export class EmailListener {
  constructor(private readonly otpRepositoryService: OtpRepositoryService) {}
  private readonly expireTime: number = 10;
  private _otp = new CodeGenerator(5);

  @OnEvent('confirmEmail')
  async ConfirmEmail(event: EmailEvent) {
    await this.handleSendEmail(event);
  }

  @OnEvent('resetPassword')
  async resetPassword(event: EmailEvent) {
    await this.handleSendEmail(event);
  }

  @OnEvent('login')
  async login(event: EmailEvent) {
    await this.handleSendEmail(event);
  }

  async handleSendEmail(event: EmailEvent) {
    const { email, userService, subject, link, text, btn, otpType } = event;
    const user = await userService.findOne({
      filter: { email, isDeleted: false },
    });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const expiryAt = new Date(Date.now() + this.expireTime * 60 * 1000);
    const code = this._otp.generateWithUpperLowerAndNumbers();
    await this.otpRepositoryService.createOtp({
      code,
      userId: user._id,
      otpType,
      expiryAt,
    });
    user.numberOfOtpSend = user.numberOfOtpSend + 1;
    await user.save();

    await sendEmail({
      to: email,
      subject,
      html: emailTemplate({
        otp: code,
        name: user.fName,
        link,
        text,
        btn,
        expiresTime: `${this.expireTime}`,
      }),
    });
  }
}
