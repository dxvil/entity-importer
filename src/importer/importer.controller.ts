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
import { EmployeeDto } from 'src/employee/employee.dto';
import { RatesDto } from 'src/rates/rates.dto';
import { Importer } from './importer';
import { Parser } from './parser';
import { ValidationImporter } from './validationImporter';

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

    const [rates, employees] = parsedFile;

    const ratesErrors = await this.validator.validate<RatesDto>(
      rates,
      RatesDto,
    );
    console.log(rates);
    if (ratesErrors.length > 0) {
      throw new BadRequestException(ratesErrors);
    }
    
    const employeesErrors = await this.validator.validate<EmployeeDto>(
      employees,
      EmployeeDto,
    );
     
    if (employeesErrors.length > 0) {
      throw new BadRequestException(employeesErrors);
    }

    // try {
    //   await this.importer.importRates(rates);
    //   return await this.importer.importEmployees(employees);
    // } catch (err) {
    //   throw new BadRequestException(err);
    // }
  }
}
