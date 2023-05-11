import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createEmployee(employee: EmployeeEntity) {
    return await this.employeeRepository.save(employee);
  }

  async updateEmployee(employee: EmployeeEntity) {
    return await this.employeeRepository.save(employee);
  }

  async findEmployee(id: number) {
    return await this.employeeRepository.findOneBy({ id: id });
  }

  async getEmployees() {
    return this.employeeRepository.find();
  }

  async countMaxDonationInTimeRange(timeRange: Date) {
    return await this.dataSource
      .getRepository(EmployeeEntity)
      .createQueryBuilder('employees')
      .select('employees.id', 'id')
      .addSelect('AVG(statements.amount)', 'avgSalary')
      .addSelect('MIN(statements.amount) / 12', 'minAnnualSalary')
      .leftJoin('employees.salary', 'statements')
      .leftJoin('employees.donations', 'donation')
      .where('statements.date >= :timeRange', { timeRange })
      .groupBy('employees.id')
      .having('SUM(donation.amount) > AVG(statements.amount) * 6 * 0.1')
      .orderBy('minAnnualSalary', 'ASC')
      .getRawMany();
  }

  async countAmountEmployeesDonatedOver100() {
    return await this.dataSource
      .getRepository(EmployeeEntity)
      .createQueryBuilder('employees')
      .leftJoin('employees.donations', 'donation')
      .select('COUNT(DISTINCT employees.id)', 'count')
      .where('CAST(donation.amount as DECIMAL(10,2)) > 100')
      .getRawOne();
  }
}
