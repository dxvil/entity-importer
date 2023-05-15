import { EmployeeEntity } from 'src/employee/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DonationTypes } from './donation-types';

@Entity('donation')
export class Donation {
  @PrimaryColumn()
  id: number;

  @Column()
  amount: string;

  @Column({
    type: 'enum',
    enum: DonationTypes,
  })
  donationType: DonationTypes;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employeeId' })
  employeeId: number;
}
