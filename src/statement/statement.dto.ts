import { IsDateString, IsDecimal, IsNotEmpty } from 'class-validator';

export class StatementDto {
  @IsNotEmpty()
  @IsDecimal()
  amount: number;
  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
