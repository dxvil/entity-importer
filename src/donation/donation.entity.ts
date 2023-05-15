import { EmployeeEntity } from 'src/employee/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DonationSign } from './donation-sign';

@Entity('donation')
export class Donation {
  @PrimaryColumn()
  id: number;

  @Column()
  amount: string;

  @Column({
    type: 'enum',
    enum: DonationSign,
  })
  donationType: DonationSign;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employeeId' })
  employeeId: number;

  @Column()
  date: Date;
}
