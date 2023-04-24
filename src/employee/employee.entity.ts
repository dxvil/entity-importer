import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation';
import { Statement } from 'src/statement/statement.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @ManyToOne(() => Department, {
    eager: true,
  })
  department: Department;

  @OneToMany(() => Statement, (statement) => statement.id, {
    eager: true,
  })
  salary: Statement[];

  @OneToMany(() => Donation, (dontation) => dontation.id)
  donations: Donation[];
}
