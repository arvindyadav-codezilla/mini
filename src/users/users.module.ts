import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Post } from './entities/post.entity';
import { Role } from './entities/role.entity';
import { IsEmailAlreadyExistConstraint } from './validators/is-email-already-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Post, Role])],
  controllers: [UsersController],
  providers: [UsersService, IsEmailAlreadyExistConstraint],
  exports: [UsersService],
})
export class UsersModule {}
