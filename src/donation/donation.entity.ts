import { EmployeeEntity } from 'src/employee/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('donation')
export class Donation {
  @PrimaryColumn()
  id: number;

  @Column()
  amount: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employeeId' })
  employeeId: number;
}
