import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeBuilder } from './employee.builder';
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from './employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeVisitor } from './employee.visitor';

@Module({
  providers: [EmployeeService, EmployeeBuilder, EmployeeVisitor],
  exports: [EmployeeService, EmployeeBuilder, EmployeeVisitor],
  controllers: [EmployeeController],
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
})
export class EmployeeModule {}
