import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'Check-mongo-id', async: false })
export class CheckMongoIds implements ValidatorConstraintInterface {
  validate(
    ids: Types.ObjectId[],
    // args: ValidationArguments
  ) {
    for (const id of ids) {
      if (!Types.ObjectId.isValid(id)) {
        return false; // Invalid ObjectId found
      }
    }
    return true; // All ObjectIds are valid
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'In-valid mongoId';
  }
}
