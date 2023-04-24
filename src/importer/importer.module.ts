import { Module } from '@nestjs/common';
import { Importer } from './importer';
import { Parser } from './parser';
import { ImporterController } from './importer.controller';
import { RatesModule } from 'src/rates/rates.module';
import { ValidationImporter } from './validationImporter';

@Module({
  providers: [Importer, Parser, ValidationImporter],
  imports: [RatesModule],
  controllers: [ImporterController],
})
export class ImporterModule {}
