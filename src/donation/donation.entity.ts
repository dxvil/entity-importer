import { Employee } from 'src/employee/employee.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('donation')
export class Donation {
  @PrimaryColumn()
  id: number;

  @Column()
  amount: string;

  @ManyToOne(() => Employee, (employee) => employee.donations)
  employee: Employee;
}
