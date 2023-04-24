import { Injectable } from '@nestjs/common';
import { EmployeeDto } from 'src/employee/employee.dto';
import { RatesDto } from 'src/rates/rates.dto';
import { RatesService } from 'src/rates/rates.service';

@Injectable()
export class Importer {
  constructor(private ratesService: RatesService) {}

  async importRates(ratesList: RatesDto[]) {
    return ratesList.forEach(async (rate) => {
      return this.ratesService.createRate(rate);
    });
  }
  async importEmployees(employeeList: EmployeeDto[]) {}
}
