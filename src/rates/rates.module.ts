import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rates } from './rates.entity';
import { RatesService } from './rates.service';

@Module({
  providers: [RatesService],
  exports: [RatesService],
  imports: [TypeOrmModule.forFeature([Rates])],
})
export class RatesModule {}
