import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseArrayPipe implements PipeTransform<string, number[]> {
  transform(value: string): number[] {
    if (!value) {
      return [];
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('Input must be a string.');
    }
    const array = value.split(',').map((item) => parseInt(item.trim(), 10));
    if (array.some(isNaN)) {
      throw new BadRequestException('All items in the array must be numbers.');
    }
    return array;
  }
}
