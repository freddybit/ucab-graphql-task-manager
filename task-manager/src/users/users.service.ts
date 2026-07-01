import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as fs from 'fs';
import * as path from 'path';
import { UserFile } from './interfaces/user-file.interface';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

  private readonly userRepository: UsersRepository;

  constructor(userRepository: UsersRepository){
    this.userRepository = userRepository;
  }

  private checkLenghtOfString(text: string, maxLenght: number): boolean {
    return text.length <= maxLenght;
  }

  existUserByEmail(email: string): boolean {
    return this.userRepository.existUserByEmail(email);
  }

  existUserById(id: number): boolean {
    return this.userRepository.existUserById(id);
  }

  createUser(input: CreateUserInput): User {

    if (this.existUserByEmail(input.email))
      throw new BadRequestException('AVISO: Ya existe un usuario con ese correo electrónico.');

    if (!this.checkLenghtOfString(input.name, 100)) 
      throw new BadRequestException('AVISO: El nombre no puede exceder los 100 caracteres.');

    if (!this.checkLenghtOfString(input.lastName, 100))
      throw new BadRequestException('AVISO: El apellido no puede exceder los 100 caracteres.');

    const newUser = this.userRepository.createUser(input);
    return newUser;
  }

  findAllUsers(): User[] {
    return this.userRepository.getAllUsers();
  }

  findUserById(id: number): User {
    const user = this.userRepository.getUserById(id);
    if (!user)
      throw new NotFoundException(`AVISO: No se encontro un usuario con el ID ${id}`);
    return user;
  }

  updateUser(id: number, input: UpdateUserInput): User {

    if (input.name && !this.checkLenghtOfString(input.name, 100)) {
      throw new BadRequestException(
        'AVISO: El nombre no puede exceder los 100 caracteres.',
      );
    }

    if (input.lastName && !this.checkLenghtOfString(input.lastName, 100)) {
      throw new BadRequestException(
        'AVISO: El apellido no puede exceder los 100 caracteres.',
      );
    }

    const updatedUser: User | undefined = this.userRepository.updateUser(id, input);

    if (!updatedUser)
      throw new NotFoundException(`ERROR: No se encontro un usuario con el ID ${id}`);

    return updatedUser;
  }

  removeUserById(id: number): boolean {
    return this.userRepository.deleteUser(id);
  }
}
