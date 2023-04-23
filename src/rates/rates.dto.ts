import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class RatesDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;
  @IsNotEmpty()
  @IsString()
  sign: string;
  @IsNumber()
  @IsPositive()
  value: number;
}
