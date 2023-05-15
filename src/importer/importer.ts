import { Injectable } from '@nestjs/common';
import { EmployeeEntity } from 'src/employee/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Rates } from 'src/rates/rates.entity';
import { RatesService } from 'src/rates/rates.service';

@Injectable()
export class Importer {
  constructor(
    private ratesService: RatesService,
    private employeeService: EmployeeService,
  ) {}

  async importRates(ratesList: Rates[]) {
    const res = {
      uploaded: [],
      errors: [],
    };

    try {
      for (const rate of ratesList) {
        await this.ratesService.createRate(rate);
        res.uploaded.push(rate);
      }
    } catch (err) {
      res.errors.push(err.message);
    }

    return res;
  }

  async importEmployees(employeeList: EmployeeEntity[]) {
    const res = {
      uploaded: [],
      errors: [],
    };

    try {
      for (const employee of employeeList) {
        await this.employeeService.createEmployee(employee);
        res.uploaded.push(employee);
      }
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') {
        res.errors.push(err.message);
      }
    }

    return res;
  }
}
