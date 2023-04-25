import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async createEmployee(employee: Employee) {
    return await this.employeeRepository.save(employee);
  }

  async findEmployee(id: number) {
    return await this.employeeRepository.findOneBy({ id: id });
  }
}
