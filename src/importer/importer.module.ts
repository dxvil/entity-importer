import { Module } from '@nestjs/common';
import { Importer } from './importer';
import { Parser } from './parser';
import { ImporterController } from './importer.controller';
import { RatesModule } from 'src/rates/rates.module';
import { ValidationImporter } from './validationImporter';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  providers: [Importer, Parser, ValidationImporter],
  imports: [RatesModule, EmployeeModule],
  controllers: [ImporterController],
})
export class ImporterModule {}
