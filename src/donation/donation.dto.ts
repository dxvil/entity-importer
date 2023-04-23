import { IsNumber, IsPositive } from 'class-validator';

export class DonationDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
