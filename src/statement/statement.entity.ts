import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('statements')
export class Statement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  date: Date;
}
