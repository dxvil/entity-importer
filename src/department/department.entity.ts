import { Employee } from 'src/employee/employee.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department, {
    eager: true,
  })
  employees: Employee[];
}
