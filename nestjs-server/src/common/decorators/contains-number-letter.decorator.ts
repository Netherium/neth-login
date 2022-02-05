import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export function ContainsNumberLetter(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'ContainsNumberLetter',
      validator: {
        validate: (value: any): boolean => value?.match(/^(?=.*[0-9])(?=.*[a-zA-Z])(.*)$/),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must contain at least 1 character and 1 number',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
