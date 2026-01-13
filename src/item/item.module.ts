import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { ItemDetails } from './item-details.entity';
import { Review } from './review.entity';
import { Tag } from './tag.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemDetails, Review, Tag]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
