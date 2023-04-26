import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentController } from './department.controller';
import { Department } from './department.entity';
import { DepartmentService } from './department.service';

@Module({
  providers: [DepartmentService],
  exports: [DepartmentService],
  controllers: [DepartmentController],
  imports: [TypeOrmModule.forFeature([Department])],
})
export class DepartmentModule {}
