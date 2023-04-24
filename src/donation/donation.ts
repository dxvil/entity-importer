import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('donation')
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;
}
