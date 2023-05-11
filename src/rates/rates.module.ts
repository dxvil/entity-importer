import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateBuilder } from './rates.builder';
import { Rates } from './rates.entity';
import { RatesService } from './rates.service';
import { RatesVisitor } from './rates.visitor';

@Module({
  providers: [RatesService, RatesVisitor, RateBuilder],
  exports: [RatesService, RatesVisitor],
  imports: [TypeOrmModule.forFeature([Rates])],
})
export class RatesModule {}
