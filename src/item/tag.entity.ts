import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Item, (item) => item.tags)
  items: Item[];
}
