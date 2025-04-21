import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import { IAttachmentType } from '../interfaces/z_index';
import { Encrypt, generateHash } from 'src/common/security/z_index';
import {
  GenderTypes,
  IUser,
  RoleTypes,
} from 'src/DB/interfaces/user.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User implements IUser {
  @Virtual({
    get: function (this: User) {
      return `${this.fName} ${this.lName}`;
    },
    set(this: User, value: string) {
      const [fName, lName] = value.split(' ');
      this.fName = fName;
      this.lName = lName;
    },
  })
  fullName: string; // Renamed the virtual property to avoid conflict

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  })
  fName: string;
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  })
  lName: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({ type: Date })
  DOB: Date;
  @Prop({ type: String, required: true, enum: GenderTypes })
  gender: GenderTypes;
  @Prop({ type: String, required: true })
  address: string;

  @Prop({
    type: String,
    enum: RoleTypes,
    default: RoleTypes.user,
  })
  role: RoleTypes;

  @Prop(
    raw({
      public_id: { type: String, require: true },
      secure_url: { type: String, require: true },
    }),
  )
  profile_img: IAttachmentType;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;

  @Prop({ type: Number, default: 0 })
  numberOfOtpSend: number;

  @Prop({ type: Date })
  confirmEmailAt: Date;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;

  @Prop({ type: Date })
  changeCredentialTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); // convert ts class to schema

export const userModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory() {
      UserSchema.pre('save', function (next: NextFunction) {
        if (this.isDirectModified('password')) {
          this.password = generateHash(this.password);
        }
        if (this.isDirectModified('phone')) {
          this.phone = Encrypt(this.phone);
        }
        return next();
      });

      UserSchema.pre('findOneAndUpdate', function (next: NextFunction) {
        const update = this.getUpdate() || {};
        if (update['password']) {
          update['password'] = generateHash(update['password'] as string);
          this.setUpdate(update);
        }
        if (update['phone']) {
          update['phone'] = Encrypt(update['phone'] as string);
          this.setUpdate(update);
        }

        return next();
      });
      return UserSchema;
    },
  },
]);

export type UserDoc = HydratedDocument<User>; // return document type contain Document & User

export const connectedUser = new Map();
