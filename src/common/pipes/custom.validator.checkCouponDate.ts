/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class CheckFromDateIsInFutureConstraint
  implements ValidatorConstraintInterface
{
  validate(fromDate: any, args?: ValidationArguments): boolean {
    return fromDate >= new Date();
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'fromDate must be in the future';
  }
}

@ValidatorConstraint({ async: true })
export class CheckToDateIsAfterFutureConstraint
  implements ValidatorConstraintInterface
{
  validate(toDate: any, args?: ValidationArguments): boolean {
    if (toDate < args?.object['fromDate']) {
      return false;
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'toDate must be in the past';
  }
}
