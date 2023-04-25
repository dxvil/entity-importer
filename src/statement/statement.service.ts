import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statement } from './statement.entity';

@Injectable()
export class StatementService {
  constructor(
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
  ) {}

  async findStatement(id: number) {
    return await this.statementRepository.findOneBy({ id });
  }

  async createStatement(statement: Statement) {
    return await this.statementRepository.save(statement);
  }
}
