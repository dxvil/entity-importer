import { IsDate, IsEnum, IsString } from 'class-validator';
import { DonationSign } from './donation-sign';

export class DonationDto {
  @IsString()
  amount: string;
  @IsEnum(DonationSign)
  donationSign: string;
  @IsDate()
  date: Date;
}
