import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';

@Module({
  providers: [EmployeeService],
  exports: [EmployeeService],
  controllers: [EmployeeController],
  imports: [TypeOrmModule.forFeature([Employee])],
})
export class EmployeeModule {}
