import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EmployeeEntity } from './employee/employee.entity';
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
import { getEnvPath } from './common/helper/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

dotenv.config({ path: envFilePath });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_URL'],
      port: Number(process.env['DB_PORT']),
      username: process.env['DB_USER'],
      password: process.env['DB_PASS'],
      database: process.env['DB_NAME'],
      synchronize: true,
      entities: [Statement, Department, Rates, Donation, EmployeeEntity],
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
