import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roles, ...userData } = createUserDto;
    const existingRoles = roles && (await this.preloadRoles(roles));

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      roles: existingRoles,
    });
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile', 'posts', 'roles'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'posts', 'roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    return user ?? undefined;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { roles: roleNames, ...userData } = updateUserDto;
    const roles = roleNames && (await this.preloadRoles(roleNames));

    const user = await this.userRepository.preload({
      id: id,
      ...userData,
      ...(roles && { roles }),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async removeMany(ids: number[]): Promise<void> {
    if (!ids || ids.length === 0) {
      return;
    }
    await this.userRepository.delete(ids);
  }

  private async preloadRoles(roleNames: string[]): Promise<Role[]> {
    const existingRoles = await this.roleRepository.findBy({
      name: In(roleNames),
    });

    const existingRoleNames = existingRoles.map((r) => r.name);
    const newRoleNames = roleNames.filter(
      (n) => !existingRoleNames.includes(n),
    );

    const newRoles = newRoleNames.map((name) =>
      this.roleRepository.create({ name }),
    );
    const createdRoles = await this.roleRepository.save(newRoles);

    return [...existingRoles, ...createdRoles];
  }
}
