import { Module } from '@nestjs/common';
import { Employee } from './employee/employee.entity';
import { Rates } from './rates/rates.entity';
import { Donation } from './donation/donation';
import { DonationService } from './donation/donation.service';
import { Department } from './department/department.entity';
import { DepartmentService } from './department/department.service';
import { Statement } from './statement/statement.entity';
import { StatementService } from './statement/statement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesModule } from './rates/rates.module';
import { ImporterModule } from './importer/importer.module';
import { EmployeeModule } from './employee/employee.module';

// type: 'mysql',
// host: 'employees.clt3fa5eyyle.eu-north-1.rds.amazonaws.com',
// port: 3306,
// username: 'admin',
// password: 'password',
// database: 'employees',
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'employees',
      synchronize: true,
      entities: [Statement, Department, Rates, Donation, Employee],
    }),
    ImporterModule,
    RatesModule,
    EmployeeModule,
  ],
  providers: [DonationService, DepartmentService, StatementService],
})
export class AppModule {}
