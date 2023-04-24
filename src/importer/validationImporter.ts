import { Injectable } from '@nestjs/common';
import { RatesDto } from 'src/rates/rates.dto';
import { validatorDto } from 'src/shared/validation';

@Injectable()
export class ValidationImporter {
  async validateRates(ratesList: RatesDto[]) {
    const errorList = [];

    for (const rate of ratesList) {
      const errors = await validatorDto(RatesDto, rate);
      errorList.push(errors);
    }

    return errorList;
  }
}
