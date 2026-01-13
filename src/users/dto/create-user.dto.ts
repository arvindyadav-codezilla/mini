import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmailAlreadyExist } from '../validators/is-email-already-exist.validator';

class CreateProfileDto {
  @ApiProperty()
  @IsString()
  bio: string;
}

class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsEmailAlreadyExist()
  email: string;

  @ApiProperty({ example: 'P@ssword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: () => CreateProfileDto })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  @ApiProperty({ type: () => [CreatePostDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePostDto)
  posts: CreatePostDto[];

  @ApiProperty({ example: ['admin', 'user'] })
  @IsString({ each: true })
  roles: string[];
}
