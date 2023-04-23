import { IsArray, ValidateNested } from 'class-validator';
import { StatementDto } from 'src/statement/statement.dto';

export class SalaryDto {
  @IsArray()
  @ValidateNested()
  statements: StatementDto[];
}
