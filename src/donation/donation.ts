import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;
}
