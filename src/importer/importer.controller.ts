import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Employee } from 'src/employee/employee.class';
import { EmployeeDto } from 'src/employee/employee.dto';
import { transformListOfEmployeesByDonation } from 'src/employee/helpers';
import { RatesDto } from 'src/rates/rates.dto';
import { Rates } from 'src/rates/rates.entity';
import { Importer } from './importer';
import { Parser } from './parser';
import { ValidationImporter } from './validationImporter';
import { EmployeeEntity } from 'src/employee/employee.entity';

@Controller('importer')
export class ImporterController {
  constructor(
    @Inject(Parser) private parser: Parser,
    @Inject(ValidationImporter) private validator: ValidationImporter,
    @Inject(Importer) private importer: Importer,
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  async importFile(@UploadedFile() file: Express.Multer.File) {
    const parsedFile = await this.parser.parseTextFile(file);

    if (parsedFile instanceof Error) {
      return parsedFile;
    }

    const [rates, employees]: [Rates[], Employee[]] = parsedFile;

    const ratesErrors = await this.validator.validate<Rates>(rates, RatesDto);

    if (ratesErrors.length > 0) {
      throw new BadRequestException(ratesErrors);
    }

    const employeesErrors = await this.validator.validate<Employee>(
      employees,
      EmployeeDto,
    );

    if (employeesErrors.length > 0) {
      throw new BadRequestException(employeesErrors);
    }

    //transform data into the correct for DB Donation table form
    const transformEmployeeByDonation: EmployeeEntity[] =
      transformListOfEmployeesByDonation(employees);

    try {
      const importRates = await this.importer.importRates(rates);
      const importEmployees = await this.importer.importEmployees(
        transformEmployeeByDonation,
      );

      return {
        rates: importRates,
        employees: importEmployees,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
