import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/employee/employee.entity';
import { DataSource, Repository } from 'typeorm';
import { Donation } from './donation.entity';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async countTotalDonationsOver100() {
    return await this.dataSource
      .getRepository(Donation)
      .createQueryBuilder('donation')
      .select('SUM(CAST(donation.amount as DECIMAL(10,2)))', 'sum')
      .where('CAST(donation.amount as DECIMAL(10,2)) > 100')
      .getRawOne();
  }

  async countRewardsForDonators(sum: number) {
    return await this.dataSource
      .getRepository(EmployeeEntity)
      .createQueryBuilder('employees')
      .leftJoin('employees.donations', 'donation')
      .select('employees.id', 'id')
      .addSelect(`CAST(donation.amount as DECIMAL(10,2)) / ${sum}`, 'share')
      .where('CAST(donation.amount as DECIMAL(10,2)) > 100')
      .getRawMany();
  }
}
