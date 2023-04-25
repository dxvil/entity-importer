import { IsDate, IsDecimal } from 'class-validator';

export class DonationDto {
  @IsDecimal()
  amount: number;
  @IsDate()
  date: Date;
}
