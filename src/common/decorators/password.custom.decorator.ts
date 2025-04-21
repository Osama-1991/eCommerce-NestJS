// Custom Decorator

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsMatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(cPassword: string, args: ValidationArguments) {
    const password = args.object[args.constraints[0] as string] as string;

    return cPassword === password;
  }
} // return True Or False

export function IsMatchPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor, // class
      propertyName: propertyName, // assigned
      options: validationOptions, // optional {whiteList: true}
      constraints: ['password'], // ["password"]
      validator: IsMatchPasswordConstraint,
    });
  };
}
