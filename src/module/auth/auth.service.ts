import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CheckEmailDto,
  confirmEmailDto,
  CreateUserDto,
  LoginDto,
  refreshTokenDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import {
  compareHash,
  UploadCloudFileService,
  TokenService,
  EmailEvent,
} from 'src/common/z_index';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IToken,
  OtpTypes,
  TokenTypes,
  OtpRepositoryService,
  UserRepositoryService,
  IUser,
  VendorSalesRepositoryService,
  RoleTypes,
} from 'src/DB/z_index';

@Injectable()
export class AuthService {
  constructor(
    private readonly Auth: TokenService,
    private readonly userRepositoryService: UserRepositoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
    private readonly otpRepositoryService: OtpRepositoryService,
    private readonly vendorSalesRepositoryService: VendorSalesRepositoryService,
    private eventEmitter: EventEmitter2,
  ) {}

  private sendConfirmEmail(email: string) {
    const confirmEmailEvent = new EmailEvent();
    confirmEmailEvent.email = email;
    confirmEmailEvent.userService = this.userRepositoryService;
    confirmEmailEvent.link = `www.google.com`;
    confirmEmailEvent.subject = 'ConfirmEmail';
    confirmEmailEvent.text = 'Confirm Email';
    confirmEmailEvent.btn = 'Confirm';
    confirmEmailEvent.otpType = OtpTypes.verifyEmail;
    this.eventEmitter.emit('confirmEmail', confirmEmailEvent);
  }

  private sendResetPassword(email: string) {
    const forgetPasswordEvent = new EmailEvent();
    forgetPasswordEvent.email = email;
    forgetPasswordEvent.userService = this.userRepositoryService;
    forgetPasswordEvent.link = `www.google.com`;
    forgetPasswordEvent.subject = 'Forget Password';
    forgetPasswordEvent.text = 'Reset Password';
    forgetPasswordEvent.btn = 'Reset';
    forgetPasswordEvent.otpType = OtpTypes.forgotPassword;
    this.eventEmitter.emit('resetPassword', forgetPasswordEvent);
  }

  async signUp(
    body: CreateUserDto,
    image?: Express.Multer.File,
  ): Promise<IUser> {
    const { email, role } = body;
    await this.userRepositoryService.checkDuplicateAccount({ email });
    let user: IUser;
    if (image) {
      const profile_img = await this.uploadCloudFileService.uploadSingleFile(
        image.path,
        {
          folder: `${process.env.CLOUDINARY_FOLDER}/Users/${email}`,
        },
      );

      user = await this.userRepositoryService.create({
        ...body,
        profile_img,
      });
    } else {
      user = await this.userRepositoryService.create({
        ...body,
      });
    }
    if (role && role === RoleTypes.vendor) {
      await this.vendorSalesRepositoryService.create({
        userId: user._id,
      });
    }
    this.sendConfirmEmail(email);
    return user;
  }

  async confirmEmail(body: confirmEmailDto): Promise<{ message: string }> {
    const { otp, email } = body;
    const userExist = await this.userRepositoryService.findOne({
      filter: { email, isConfirmed: false },
    });
    if (!userExist) {
      throw new NotFoundException('Invalid email');
    }
    const otpExist = await this.otpRepositoryService.getCode({
      userId: userExist._id,
      otpType: OtpTypes.verifyEmail,
    });

    if (!otpExist) {
      throw new NotFoundException('Invalid otp or expired');
    }
    if (!compareHash(otp, otpExist?.code)) {
      throw new BadRequestException('Invalid otp');
    }
    await this.userRepositoryService.findOneAndUpdate({
      filter: { email },
      update: {
        isConfirmed: true,
        confirmEmailAt: new Date(),
        numberOfOtpSend: 0,
      },
    });
    await this.otpRepositoryService.deleteOne({
      filter: {
        userId: userExist._id,
        otpType: OtpTypes.verifyEmail,
      },
    });
    return { message: 'Confirmed successfully' };
  }

  async sendOtpConfirmEmail(body: {
    email: string;
  }): Promise<{ message: string }> {
    const { email } = body;
    const user = await this.userRepositoryService.findOne({
      filter: {
        email,
        isConfirmed: false,
        isDeleted: false,
        numberOfOtpSend: { $lte: 5 },
      },
    });
    if (!user) {
      throw new NotFoundException(
        'User not found , or confirmed or has been deleted , or blocked from sending more than 5 times requested',
      );
    }

    await this.otpRepositoryService.checkOtpExist({
      userId: user._id,
      otpType: OtpTypes.verifyEmail,
    });

    this.sendConfirmEmail(email);

    return { message: 'Otp has been sent successfully' };
  }

  async login(body: LoginDto): Promise<{
    message: string;
    data: { token: IToken };
  }> {
    const { email, password } = body;
    const user =
      await this.userRepositoryService.checkEmailExistAndConfirmed(email);
    if (!user) {
      throw new BadRequestException('Invalid login data');
    }

    if (!compareHash(password, user.password)) {
      throw new BadRequestException('Invalid login data');
    }

    const accessToken = this.Auth.sign({
      type: TokenTypes.access,
      role: user.role,
      payload: { id: user._id, email },
    });

    const refreshToken = this.Auth.sign({
      type: TokenTypes.refresh,
      role: user.role,
      payload: { id: user._id, email },
    });
    await this.userRepositoryService.updateOne({
      filter: { _id: user._id },
      update: { $set: { changeCredentialTime: new Date() } },
    });

    return {
      message: 'login successfully',
      data: { token: { accessToken, refreshToken } },
    };
  }

  async forgetPassword(body: CheckEmailDto): Promise<{ message: string }> {
    const { email } = body;
    const user =
      await this.userRepositoryService.checkEmailExistAndConfirmed(email);

    await this.otpRepositoryService.checkOtpExist({
      userId: user._id,
      otpType: OtpTypes.forgotPassword,
    });
    this.sendResetPassword(email);
    return { message: 'Reset password link has been sent successfully' };
  }

  async resetPassword(body: ResetPasswordDto): Promise<{ message: string }> {
    const { otp, password, email } = body;
    const userExist =
      await this.userRepositoryService.checkEmailExistAndConfirmed(email);

    const otpExist = await this.otpRepositoryService.getCode({
      userId: userExist._id,
      otpType: OtpTypes.forgotPassword,
    });

    if (!compareHash(otp, otpExist?.code)) {
      throw new BadRequestException('Invalid otp');
    }
    await this.userRepositoryService.findOneAndUpdate({
      filter: { email },
      update: {
        password,
        changeCredentialTime: new Date(),
        numberOfOtpSend: 0,
      },
    });
    await this.otpRepositoryService.deleteOne({
      filter: {
        userId: userExist._id,
        otpType: OtpTypes.forgotPassword,
      },
    });
    return { message: 'Password reset successfully' };
  }

  async refreshToken(body: refreshTokenDto): Promise<{
    message: string;
    data: { token: Partial<IToken> };
  }> {
    const { authorization } = body;
    const user = await this.Auth.verify({
      authorization,
      type: TokenTypes.refresh,
    });
    if (!user || !user.email) {
      throw new NotFoundException('User not found or email is missing');
    }
    const accessToken = this.Auth.sign({
      type: TokenTypes.access,
      role: user.role,
      payload: { id: user._id, email: user.email },
    });
    return {
      message: 'token refresh successfully',
      data: { token: { accessToken } },
    };
  }
}
