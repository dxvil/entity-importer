import { IsDate, IsNumber, IsPositive } from 'class-validator';

export class DonationDto {
  @IsNumber()
  @IsPositive()
  amount: number;
  @IsDate()
  date: Date;
}
