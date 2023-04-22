import { Statement } from 'src/statement/statement.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('salaries')
export class Salary {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Statement, (statement) => statement.id)
  statements: Statement[];
}
