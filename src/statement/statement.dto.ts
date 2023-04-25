import { IsDate, IsDecimal, IsNotEmpty } from 'class-validator';

export class StatementDto {
  @IsNotEmpty()
  @IsDecimal()
  amount: number;
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
