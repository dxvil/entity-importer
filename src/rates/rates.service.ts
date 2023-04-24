import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatesDto } from './rates.dto';
import { Rates } from './rates.entity';

@Injectable()
export class RatesService {
  constructor(@InjectRepository(Rates) private ratesRepo: Repository<Rates>) {}

  async createRate(newRate: RatesDto): Promise<Rates> {
    return this.ratesRepo.save(newRate);
  }
}
