import {
  BadRequestException,
  Catch,
  Controller,
  HttpException,
  Inject,
  ParseArrayPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployeeDto } from 'src/employee/employee.dto';
import { RatesDto } from 'src/rates/rates.dto';
import { Rates } from 'src/rates/rates.entity';
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

    // const ratesErrors = await this.validator.validate<RatesDto>(
    //   rates,
    //   RatesDto,
    // );

    // if (ratesErrors.length > 0) {
    //   throw new BadRequestException(ratesErrors);
    // }
    console.log(employees[12]);
    const employeesErrors = await this.validator.validate<EmployeeDto>(
      [employees[12]],
      EmployeeDto,
    );
    // const employeesErrors = await this.validator.validate<EmployeeDto>(
    //   employees,
    //   EmployeeDto,
    // );

    if (employeesErrors.length > 0) {
      throw new BadRequestException(employeesErrors);
    }
  }
}
