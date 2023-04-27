import { Module } from '@nestjs/common';
import { Employee } from './employee/employee.entity';
import { Rates } from './rates/rates.entity';
import { Donation } from './donation/donation.entity';
import { Department } from './department/department.entity';
import { Statement } from './statement/statement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesModule } from './rates/rates.module';
import { ImporterModule } from './importer/importer.module';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { StatementModule } from './statement/statement.module';
import { DonationModule } from './donation/donation.module';

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
    DepartmentModule,
    StatementModule,
    DonationModule,
  ],
})
export class AppModule {}
