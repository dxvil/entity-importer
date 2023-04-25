import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation.entity';
import { Statement } from 'src/statement/statement.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @ManyToOne(() => Department, (department) => department.id, {
    eager: true,
    cascade: ['insert'],
  })
  department: Department;

  @OneToMany(() => Statement, (statement) => statement.employee, {
    eager: true,
    cascade: ['insert'],
  })
  salary: Statement[];

  @OneToMany(() => Donation, (dontation) => dontation.id, {
    eager: true,
    cascade: ['insert'],
  })
  donations: Donation[];
}
