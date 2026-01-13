import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';
import { Tag } from './tag.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(
    createItemDto: CreateItemDto,
    imagePath: string | null,
  ): Promise<Item> {
    const { tags: tagNames, ...itemDetails } = createItemDto;
    const tags = await this.preloadTags(tagNames);

    const item = this.itemRepository.create({
      ...itemDetails,
      image: imagePath,
      tags,
    });

    return this.itemRepository.save(item);
  }

  findAll(): Promise<Item[]> {
    return this.itemRepository.find({ relations: ['tags'] });
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const { tags: tagNames, ...itemDetails } = updateItemDto;
    const tags = tagNames && (await this.preloadTags(tagNames));

    const item = await this.itemRepository.preload({
      id: id,
      ...itemDetails,
      tags,
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return this.itemRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
  }

  findItemsWithDetails(): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.details', 'details')
      .getMany();
  }

  findAllWithReviews(): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.reviews', 'review')
      .getMany();
  }

  findItemsByTag(tagName: string): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.tags', 'tag')
      .where('tag.name = :tagName', { tagName })
      .getMany();
  }

  private async preloadTags(tagNames: string[] | undefined): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }
    const existingTags = await this.tagRepository.findBy({
      name: In(tagNames),
    });

    const existingTagNames = existingTags.map((t) => t.name);
    const newTagNames = tagNames.filter((n) => !existingTagNames.includes(n));

    const newTags = newTagNames.map((name) =>
      this.tagRepository.create({ name }),
    );
    const createdTags = await this.tagRepository.save(newTags);

    return [...existingTags, ...createdTags];
  }
}
