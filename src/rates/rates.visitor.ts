import { Injectable } from '@nestjs/common';
import { RATE } from 'src/employee/employeeConstans';
import { RateBuilder } from './rates.builder';
import { IRatesVisitor } from './visitor.interface';

@Injectable()
export class RatesVisitor implements IRatesVisitor {
  currentVisit: string;
  prevVisit: string;
  constructor(private ratesBuilder: RateBuilder) {}

  setVisit(visit: string) {
    this.currentVisit = visit;
  }

  getVisit() {
    return this.currentVisit;
  }

  setPrevVisit(visit: string) {
    this.prevVisit = visit;
  }

  getPrevVisit() {
    return this.prevVisit;
  }

  visitRates(visit: string, key?: any, value?: any) {
    this.setPrevVisit(this.currentVisit);
    this.endVisit(visit);
    if (visit === RATE) {
      this.ratesBuilder.buildRate();
    } else if (visit === ':') {
      this.ratesBuilder.valueInsertion(key, value);
    }

    this.setVisit(visit);
  }

  endVisit(visit: string) {
    if (
      (this.getPrevVisit() &&
        this.getVisit() &&
        this.getPrevVisit() === ':' &&
        visit === RATE) ||
      visit === 'END'
    ) {
      this.ratesBuilder.endBuildRate();
    }
  }

  end() {
    return this.ratesBuilder.build();
  }
}
