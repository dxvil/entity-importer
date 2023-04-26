import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @Get('/')
  async get() {
    return await this.employeeService.getEmployees();
  }

  @Get('/count-max-donations')
  async getCountMaxDonationInTimeRange(@Param('timeRange') timeRange: number) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - timeRange);

    return await this.employeeService.countMaxDonationInTimeRange(sixMonthsAgo);
  }
}
