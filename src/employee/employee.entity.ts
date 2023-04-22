import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation';
import { Salary } from 'src/salary/salary.entity';
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

  @ManyToOne(() => Salary, {
    eager: true,
  })
  salary: Salary;

  @OneToMany(() => Donation, (dontation) => dontation.id)
  dontations: Donation[];
}
