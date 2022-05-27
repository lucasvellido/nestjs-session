import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const result = await this.prisma.user.create({
      data: createUserDto,
    });

    return {
      msg: 'User successfully registered',
      userId: result.id,
      email: result.email,
    };
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
