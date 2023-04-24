import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const validatorDto = async <T extends ClassConstructor<any>>(
  dto: T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: Object,
) => {
  const objInstance = plainToClass(dto, obj);
  const errors = await validate(objInstance);

  const res = {
    failed: [],
    values: [],
    errors: [],
  };

  if (errors.length > 0) {
    errors.forEach((err) => {
      const name = err.property;
      const errorMsg = Object.values(err.constraints);
      const { value } = err;

      res.failed.push(name);
      res.values.push(value);
      res.errors.push(...errorMsg);
    });
  }

  return res;
};
