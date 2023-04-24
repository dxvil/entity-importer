import { Injectable } from '@nestjs/common';
import { validatorDto } from 'src/shared/validation';

@Injectable()
export class ValidationImporter {
  async validate<T>(objList: T[], type) {
    const errorList = [];

    for (const obj of objList) {
      const errors = await validatorDto(type, obj);
      if (errors.errors.length > 0) {
        errorList.push(errors);
      }
    }

    return errorList;
  }
}
