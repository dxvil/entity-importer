import { IsDate, IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class RatesDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;
  @IsNotEmpty()
  @IsString()
  sign: string;
  @IsDecimal()
  value: string;
}
