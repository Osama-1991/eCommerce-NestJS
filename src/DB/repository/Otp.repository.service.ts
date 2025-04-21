import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Otp, OtpDoc, OtpTypes } from 'src/DB/z_index';
import { Model, Types } from 'mongoose';

interface IOtpOptions {
  userId: Types.ObjectId;
  otpType: OtpTypes;
}

interface IOtpCode extends IOtpOptions {
  code: string;
  expiryAt: Date;
}

@Injectable()
export class OtpRepositoryService extends DBRepository<OtpDoc> {
  constructor(@InjectModel(Otp.name) private OtpModel: Model<OtpDoc>) {
    super(OtpModel);
  }

  async createOtp({
    code,
    userId,
    otpType,
    expiryAt,
  }: IOtpCode): Promise<OtpDoc> {
    const otp = await this.create({
      code,
      userId,
      otpType,
      expiryAt,
    });
    return otp;
  }

  async getCode({ userId, otpType }: IOtpOptions): Promise<OtpDoc> {
    const otp = await this.findOne({
      filter: {
        userId,
        otpType,
        expiryAt: { $gte: new Date() },
      },
    });
    if (!otp) {
      throw new NotFoundException('Invalid otp or expired');
    }
    return otp;
  }

  async deleteExpiredOtp(): Promise<void> {
    await this.deleteMany({
      filter: { expiryAt: { $lt: new Date() } },
    });
    return;
  }

  async deleteAllOtpByUserId(userId: Types.ObjectId): Promise<void> {
    await this.deleteMany({ filter: { userId } });
    return;
  }
  async deleteOneByUserIdAndOtpType(
    userId: Types.ObjectId,
    otpType: OtpTypes,
  ): Promise<void> {
    await this.deleteOne({
      filter: { userId, otpType },
    });
    return;
  }

  async checkOtpExist({ userId, otpType }: IOtpOptions): Promise<void> {
    const otp = await this.find({
      filter: {
        userId,
        otpType,
        expiryAt: { $gte: new Date() },
      },
    });
    if (otp.length > 0) {
      throw new ConflictException('Otp has already been sent');
    }
    return;
  }
}
