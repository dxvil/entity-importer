import { Employee } from 'src/employee/employee.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('statements')
export class Statement {
  @PrimaryColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  date: Date;

  @ManyToOne(() => Employee, (employee) => employee.salary)
  employee: Employee;
}
