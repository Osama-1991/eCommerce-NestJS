import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderTypes } from 'src/DB/z_index';

export class DeleteImageDto {
  @IsString({ message: 'public_id must be string' })
  @MinLength(2)
  @IsNotEmpty()
  public_id: string;
}

export class updateProfileInfoDto {
  @IsString({ message: 'FName must be string' })
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  fName: string;
  @IsString({ message: 'FName must be string' })
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  lName: string;
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  DOB: Date;
  @IsEnum(GenderTypes)
  @IsOptional()
  gender: GenderTypes;
  @MinLength(2)
  @IsString({ message: 'address must be string' })
  @IsOptional()
  address: string;
}
