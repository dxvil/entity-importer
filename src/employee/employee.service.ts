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

  async countMaxDonationInTimeRange() {
    //default values only based on test data
    //test data includes information about 2020-2021 years
    const halfOfYear = '2020-06-01 00:00:00';
    const forYear = '2020-01-01 00:00:00';
    if (
      !Number.isNaN(Date.parse(halfOfYear)) &&
      !Number.isNaN(Date.parse(forYear))
    ) {
      return await this.dataSource.query(`
      WITH avg_sal_min AS (
        SELECT 
          employees.id, 
          ROUND(
            AVG(statements.amount), 
            0
          ) AS avgSalYear 
        FROM 
          employees 
          INNER JOIN statements ON employees.id = statements.employeeId 
        WHERE 
          statements.date >= '${forYear}'
        GROUP BY 
          employees.id
      ) 
      SELECT 
        employees.name, 
        avg_sal_min.avgSalYear, 
        ROUND(
          AVG(statements.amount)
        ) as avgSalHalfYear, 
        ROUND(
          SUM(donation.amount), 
          0
        ) AS total_don 
      FROM 
        employees 
        INNER JOIN statements ON employees.id = statements.employeeId 
        INNER JOIN donation ON employees.id = donation.employeeId 
        INNER JOIN avg_sal_min ON employees.id = avg_sal_min.id 
      WHERE 
        statements.date >= '${halfOfYear}'
      GROUP BY 
        employees.id 
      HAVING 
        ROUND(
          SUM(donation.amount), 
          0
        ) > (avgSalHalfYear / 10) 
      ORDER BY 
        avg_sal_min.avgSalYear ASC;
    `);
    }
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
