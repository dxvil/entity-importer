import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeDto } from './employee.dto';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async createEmployee(employee: EmployeeDto | Employee) {
    return await this.employeeRepository.save(employee);
  }
}
