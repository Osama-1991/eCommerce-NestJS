import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsEnum,
  Matches,
  IsDate,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMatchPassword } from 'src/common/decorators/password.custom.decorator';
import { IAttachmentType, IUser } from 'src/DB/z_index';
import { GenderTypes, RoleTypes } from 'src/DB/interfaces/user.interface';

export class CheckEmailDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class confirmEmailDto extends CheckEmailDto {
  @IsNotEmpty()
  @Matches(/^[0-9A-Za-z]{5}$/)
  otp: string;
}

export class ResetPasswordDto extends CheckEmailDto {
  @IsNotEmpty()
  @Matches(/^[0-9A-Za-z]{5}$/)
  otp: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
  @IsNotEmpty()
  @IsStrongPassword()
  @IsMatchPassword({ message: 'password is not match cPassword' }) // custom decorator
  cPassword: string;
}

export class LoginDto extends CheckEmailDto {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class CreateUserDto extends LoginDto implements IUser {
  @IsOptional()
  _id: Types.ObjectId;
  @IsString({ message: 'FName is required field' })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  fName: string;
  @IsString({ message: 'FName is required field' })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lName: string;
  @IsNotEmpty()
  @IsStrongPassword()
  @IsMatchPassword({ message: 'password is not match cPassword' }) // custom decorator
  cPassword: string;
  @IsDate()
  @Transform(({ value }) => new Date(value))
  DOB: Date;
  @IsNotEmpty()
  @IsEnum(GenderTypes)
  gender: GenderTypes;
  @MinLength(2)
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(12)
  phone: string;
  @IsOptional()
  isDeleted: boolean;
  @IsEnum(RoleTypes)
  @IsOptional()
  role: RoleTypes;
  @IsOptional()
  isConfirmed: boolean;
  @IsOptional()
  confirmEmail: Date;
  @IsOptional()
  profile_img: IAttachmentType;
}

export class refreshTokenDto {
  @IsString({ message: 'Token is required field' })
  @IsNotEmpty()
  @MinLength(2)
  authorization: string;
}
