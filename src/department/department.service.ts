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
    return await this.dataSource
      .getRepository(Department)
      .createQueryBuilder('departments')
      .addSelect(
        'MAX(statements.amount) - MIN(statements.amount)',
        'salary_diff',
      )
      .leftJoin('departments.employees', 'employees')
      .leftJoin('employees.salary', 'statements')
      .groupBy('departments.name')
      .addGroupBy('departments.id')
      .orderBy('salary_diff', 'DESC')
      .where((sq) => {
        sq.subQuery()
          .select('GROUP_CONCAT(employees.name SEPARATOR ", ")', 'names')
          .addSelect(
            '(MAX(CASE WHEN statements.id = :sid THEN statements.amount END) - LAG(MAX(CASE WHEN statements.id = :sid THEN statements.amount END)) OVER (PARTITION BY employees.departmentId ORDER BY MAX(CASE WHEN statements.id = :sid THEN statements.amount END) DESC)) / LAG(MAX(CASE WHEN statements.id = :sid THEN statements.amount END)) OVER (PARTITION BY employees.departmentId ORDER BY MAX(CASE WHEN statements.id = :sid THEN statements.amount END) DESC) * 100',
            'percentage_increase',
          )
          .from(EmployeeEntity, 'employees')
          .leftJoin('employees.salary', 'statements')
          .where('employees.departmentId = departments.id')
          .orderBy('percentage_increase', 'DESC')
          .limit(3)
          .setParameters({
            sid: this.dataSource
              .getRepository(Statement)
              .createQueryBuilder('statements')
              .select('MAX(statements.id)')
              .getQuery(),
          });
      })
      .getRawMany();
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
