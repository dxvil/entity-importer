import { HttpException, Injectable } from '@nestjs/common';
import { EmployeeDto } from 'src/employee/employee.dto';
import { Employee } from 'src/employee/employee.entity';
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
    try {
      return ratesList.forEach(async (rate) => {
        return this.ratesService.createRate(rate);
      });
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }
  async importEmployees(employeeList: EmployeeDto[] | Employee[]) {
    try {
      return employeeList.forEach(async (employee) => {
        return this.employeeService.createEmployee(employee);
      });
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }
}
