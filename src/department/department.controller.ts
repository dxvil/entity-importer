import { Controller, Get } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('departments')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}
  @Get('/')
  async getAll() {
    return await this.departmentService.findAll();
  }
  @Get('/stat')
  async getDepartmentSalaryStat() {
    return await this.departmentService.departmentSalaryStat();
  }
}
