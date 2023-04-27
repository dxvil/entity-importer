import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from 'src/department/department.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { DonationController } from './donation.controller';
import { Donation } from './donation.entity';
import { DonationService } from './donation.service';

@Module({
  controllers: [DonationController],
  providers: [DonationService],
  imports: [
    TypeOrmModule.forFeature([Donation]),
    EmployeeModule,
    DepartmentModule,
  ],
  exports: [DonationService],
})
export class DonationModule {}
