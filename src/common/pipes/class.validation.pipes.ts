import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipeOptions,
  InternalServerErrorException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class customValidationPipe implements PipeTransform<any> {
  constructor(private options?: ValidationPipeOptions) {}

  async transform(
    value: Record<string, any>,
    { metatype }: ArgumentMetadata,
  ): Promise<Record<string, any>> {
    try {
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }

      if (!value || typeof value !== 'object') {
        throw new BadRequestException('Cannot send empty body');
      }

      const object = plainToInstance<typeof metatype, Record<string, any>>(
        metatype,
        value,
      );
      const errors = await validate(object);

      if (errors.length > 0) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      }

      return value;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    try {
      const types: (new (...args: any[]) => any)[] = [
        String,
        Boolean,
        Number,
        Array,
        Object,
      ];
      return !types.includes(metatype);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
