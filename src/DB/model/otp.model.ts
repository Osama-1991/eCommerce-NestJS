import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IOtp, OtpTypes } from '../interfaces/z_index';
import { NextFunction } from 'express';
import { generateHash } from 'src/common/security/z_index';
import { User } from './user.model';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Otp implements IOtp {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  code: string;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;
  @Prop({ type: String, required: true, enum: OtpTypes })
  otpType: OtpTypes;
  @Prop({ type: Date, required: true })
  expiryAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp); // convert ts class to schema

export const otpModel = MongooseModule.forFeatureAsync([
  {
    name: Otp.name,
    useFactory() {
      OtpSchema.pre('save', function (next: NextFunction) {
        if (this.isDirectModified('code')) {
          this.code = generateHash(this.code);
        }
        return next();
      });
      return OtpSchema;
    },
  },
]);

export type OtpDoc = HydratedDocument<Otp>;
