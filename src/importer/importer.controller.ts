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

    const errors = await this.validator.validateRates(parsedFile);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}
