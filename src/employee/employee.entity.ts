import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation.entity';
import { Statement } from 'src/statement/statement.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('employees')
export class EmployeeEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @ManyToOne(() => Department, (dep) => dep.employees, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(() => Statement, (statement) => statement.employeeId, {
    eager: true,
    cascade: ['insert'],
  })
  salary: Statement[];

  @OneToMany(() => Donation, (donation) => donation.employeeId, {
    eager: true,
    cascade: ['insert'],
  })
  donations: Donation[];
}
