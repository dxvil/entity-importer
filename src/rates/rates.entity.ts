import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rates')
export class Rates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  sign: string;

  @Column({
    type: 'decimal',
  })
  value: string;
}
