import { HttpException, Injectable } from '@nestjs/common';
import { Department } from 'src/department/department.entity';
import { DepartmentService } from 'src/department/department.service';
import { EmployeeEntity } from 'src/employee/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Rates } from 'src/rates/rates.entity';
import { RatesService } from 'src/rates/rates.service';

@Injectable()
export class Importer {
  constructor(
    private ratesService: RatesService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
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
  async importDepartment(department: Department) {
    try {
      await this.departmentService.createDepartment(department);
      return department;
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY' || err.errno !== 1062) {
        throw new HttpException(err.message, 400);
      }
    }
  }
  async importEmployees(employeeList: EmployeeEntity[]) {
    const res = {
      uploadedEmployees: [],
      uploadedDeparments: [],
      errors: [],
    };

    for (const employee of employeeList) {
      try {
        await this.importDepartment(employee.department);
        res.uploadedDeparments.push(employee.department);
        await this.employeeService.createEmployee(employee);
        res.uploadedEmployees.push(employee);
      } catch (err) {
        res.errors.push(err.message);
      }
    }

    return res;
  }
}
