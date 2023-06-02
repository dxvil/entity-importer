import { Controller, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @Get('/')
  async get() {
    return await this.employeeService.getEmployees();
  }

  @Get('/count-max-donations')
  async getCountMaxDonationInTimeRange() {
    return await this.employeeService.countMaxDonationInTimeRange();
  }
}
