import { IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class StatementDto {
  @IsNumber()
  @IsPositive()
  amount: number;
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
