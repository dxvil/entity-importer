import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Importer } from './importer';

@Controller('importer')
export class ImporterController {
  constructor(@Inject(Importer) private importer: Importer) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(@UploadedFile() file: Express.Multer.File) {
    const parsedFile = await this.importer.parseTextFile(file);

    if (parsedFile instanceof Error) {
      return parsedFile;
    }
  }
}
