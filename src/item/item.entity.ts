import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ItemDetails } from './item-details.entity';
import { Review } from './review.entity';
import { Tag } from './tag.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true, type: 'varchar' })
  image: string | null;

  @OneToOne(() => ItemDetails, (details) => details.item, { cascade: true })
  details: ItemDetails;

  @OneToMany(() => Review, (review) => review.item, { cascade: true })
  reviews: Review[];

  @ManyToMany(() => Tag, (tag) => tag.items, { cascade: true })
  @JoinTable()
  tags: Tag[];
}
