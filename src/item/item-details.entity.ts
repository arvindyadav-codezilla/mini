import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class ItemDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  material: string;

  @Column()
  weight: number;

  @OneToOne(() => Item, (item) => item.details)
  @JoinColumn()
  item: Item;
}
