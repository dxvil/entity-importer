import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statement } from './statement.entity';
import { StatementService } from './statement.service';

@Module({
  providers: [StatementService],
  exports: [StatementService],
  imports: [TypeOrmModule.forFeature([Statement])],
})
export class StatementModule {}
