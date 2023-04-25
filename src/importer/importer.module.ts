import { Module } from '@nestjs/common';
import { Importer } from './importer';
import { Parser } from './parser';
import { ImporterController } from './importer.controller';
import { RatesModule } from 'src/rates/rates.module';
import { ValidationImporter } from './validationImporter';
import { EmployeeModule } from 'src/employee/employee.module';
import { DepartmentModule } from 'src/department/department.module';
import { StatementModule } from 'src/statement/statement.module';

@Module({
  providers: [Importer, Parser, ValidationImporter],
  imports: [RatesModule, EmployeeModule, DepartmentModule, StatementModule],
  controllers: [ImporterController],
})
export class ImporterModule {}
