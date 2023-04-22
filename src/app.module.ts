import { Module } from '@nestjs/common';
import { Employee } from './employee/employee.entity';
import { EmployeeService } from './employee/employee.service';
import { EmployeeController } from './employee/employee.controller';
import { Rates } from './rates/rates.entity';
import { RatesService } from './rates/rates.service';
import { Salary } from './salary/salary.entity';
import { SalaryService } from './salary/salary.service';
import { Donation } from './donation/donation';
import { DonationService } from './donation/donation.service';
import { Department } from './department/department.entity';
import { DepartmentService } from './department/department.service';
import { Statement } from './statement/statement.entity';
import { StatementService } from './statement/statement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImporterController } from './importer/importer.controller';
import { Importer } from './importer/importer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'employees.clt3fa5eyyle.eu-north-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'password',
      database: 'employees',
      synchronize: true,
      entities: [Statement, Department, Rates, Salary, Donation, Employee],
    }),
  ],
  controllers: [EmployeeController, ImporterController],
  providers: [
    Importer,
    EmployeeService,
    RatesService,
    SalaryService,
    DonationService,
    DepartmentService,
    StatementService,
  ],
})
export class AppModule {}
