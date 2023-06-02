import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/employee/employee.entity';
import { Statement } from 'src/statement/statement.entity';
import { DataSource, Repository } from 'typeorm';
import { Department } from './department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createDepartment(department: Department) {
    const isExist = await this.findDepartment(department.id);

    if (!isExist) {
      return await this.departmentRepository.save(department);
    }
  }
  async findAll() {
    return await this.departmentRepository.find();
  }
  async findDepartment(id: number) {
    return await this.departmentRepository.findOneBy({ id });
  }

  async departmentSalaryStat() {
    //hardcoded values for test data
    //for prod version should be refactored
    const firstMonthSalaryStartDate = '2021-01-01';
    const firstMonthSalaryEndDate = '2021-01-31';
    const lastMonthSalaryStartDate = '2021-12-01';
    const lastMonthSalaryEndDate = '2021-12-31';

    if (
      !Number.isNaN(Date.parse(firstMonthSalaryStartDate)) &&
      !Number.isNaN(Date.parse(firstMonthSalaryEndDate)) &&
      !Number.isNaN(Date.parse(lastMonthSalaryStartDate)) &&
      !Number.isNaN(Date.parse(lastMonthSalaryEndDate))
    ) {
      return this.dataSource.query(`
    WITH min_sal_table AS (
      SELECT 
        date, 
        MIN(amount) as minSal, 
        employeeId, 
        departments.id as depId 
      FROM 
        statements 
        INNER JOIN employees ON statements.employeeId = employees.id 
        INNER JOIN departments ON employees.departmentId = departments.id 
      WHERE 
        date >= '${firstMonthSalaryStartDate}'
        AND date <= '${firstMonthSalaryEndDate}' 
      GROUP BY 
        employeeId, 
        date, 
        departments.id
    ), 
    max_sal_table AS (
      SELECT 
        date, 
        MAX(amount) as maxSal, 
        amount as lastSal, 
        employeeId, 
        departments.id as depId 
      FROM 
        statements 
        INNER JOIN employees ON statements.employeeId = employees.id 
        INNER JOIN departments ON employees.departmentId = departments.id 
      WHERE 
        date >= '${lastMonthSalaryStartDate}' 
        AND date <= '${lastMonthSalaryEndDate}' 
      GROUP BY 
        employeeId, 
        date, 
        departments.id, 
        amount
    ) 
    SELECT 
      * 
    FROM 
      (
        SELECT 
          max_sal_table.depId as depId, 
          MAX(
            (
              max_sal_table.maxSal - min_sal_table.minSal
            ) / min_sal_table.minSal * 100
          ) as rate, 
          max_sal_table.lastSal, 
          statements.employeeId, 
          ROW_NUMBER() OVER (
            PARTITION BY departments.id 
            ORDER BY 
              MAX(
                (
                  max_sal_table.maxSal - min_sal_table.minSal
                ) / min_sal_table.minSal * 100
              ) ASC
          ) AS row_num 
        FROM 
          statements 
          INNER JOIN employees ON statements.employeeId = employees.id 
          INNER JOIN departments ON employees.departmentId = departments.id 
          INNER JOIN min_sal_table ON statements.employeeId = min_sal_table.employeeId 
          INNER JOIN max_sal_table ON statements.employeeId = max_sal_table.employeeId 
        GROUP BY 
          depId, 
          employeeId
      ) AS subquery 
    WHERE 
      row_num < 4;
    `);
    }
  }

  async departmentWithTheHighestDonatePerPerson() {
    return await this.dataSource
      .getRepository(Department)
      .createQueryBuilder('departments')
      .leftJoin('departments.employees', 'employee')
      .leftJoin('employee.donations', 'donation')
      .select('departments.id', 'id')
      .addSelect(
        'SUM(CAST(donation.amount as DECIMAL(10,2))) / COUNT(DISTINCT employee.id)',
        'donationPerPerson',
      )
      .groupBy('departments.id')
      .orderBy('donationPerPerson', 'DESC')
      .getRawOne();
  }
}
