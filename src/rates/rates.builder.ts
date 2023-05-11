import { Injectable } from '@nestjs/common';
import { IRatesBuilder } from './builder.interface';
import { Rates } from './rates.entity';

@Injectable()
export class RateBuilder implements IRatesBuilder {
  rates: Rates[] = [];
  currentRate: null | Rates;

  buildRate() {
    this.currentRate = new Rates();
  }

  endBuildRate() {
    this.rates.push(this.currentRate);
    this.currentRate = null;
  }

  valueInsertion(key: any, value: any) {
    this.currentRate[key] = value;
  }

  build() {
    return this.rates;
  }
}
