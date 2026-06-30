import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as fs from 'fs';
import * as path from 'path';
import { UserFile } from './interfaces/user-file.interface';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements OnModuleInit {

  private readonly usersFilePath = path.join(process.cwd(), 'data', 'users-data.json');

  private checkLenghtOfString(text: string, maxLenght: number): boolean {
    return text.length <= maxLenght;
  }

    private readFile(): UserFile {
      const fileContent = fs.readFileSync(this.usersFilePath, 'utf-8');
      return JSON.parse(fileContent) as UserFile;
    }
  
    private saveFile(data: UserFile): void {
      fs.writeFileSync(
        this.usersFilePath,
        JSON.stringify(data, null, 2),
        'utf-8',
      );
    }

  onModuleInit() {
    const directory = path.dirname(this.usersFilePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (!fs.existsSync(this.usersFilePath)) {
      const startStructure: UserFile = { lastId: 0, users: [] };
      this.saveFile(startStructure);
    }
  }

  existUserByEmail(email: string): boolean {
    const json = this.readFile();
    return json.users.some((user) => user.email === email);
  }

  existUserById(id: number): boolean {
    const json = this.readFile();
    return json.users.some((user) => user.idUser === id);
  }

  createUser(input: CreateUserInput): User {
    const json = this.readFile();

    if (this.existUserByEmail(input.email)) {
      throw new BadRequestException('Ya existe un usuario con ese correo electrónico.');
    }

    if (!this.checkLenghtOfString(input.name, 100)) {
      throw new BadRequestException('El nombre no puede exceder los 100 caracteres.');
    }

    if (!this.checkLenghtOfString(input.lastName, 100)) {
      throw new BadRequestException('El apellido no puede exceder los 100 caracteres.');
    }


    const newUser: User = {
      idUser: json.lastId,
      name: input.name,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
    };
    
    json.lastId++;
    json.users.push(newUser);
    this.saveFile(json);

    return newUser;
  }

  findAllUsers(): User[] {
    const json = this.readFile();
    return json.users;
  }

  findUserById(id: number): User {
    const json = this.readFile();
    const user = json.users.find((usr) => usr.idUser === id);
    if (!user) throw new NotFoundException('No se encontró un usuario con el ID ' + id);
    return user;
  }

  updateUser(input: UpdateUserInput): User {
    const json = this.readFile();
    const userIndex = json.users.findIndex((usr) => usr.idUser == input.idUser);

    if (userIndex === -1) {
      throw new NotFoundException('No se encontró un usuario con el ID ' + input.idUser);
    }

    if (input.name && !this.checkLenghtOfString(input.name, 100)) {
      throw new BadRequestException('El nombre no puede exceder los 100 caracteres.');
    }

    if (input.lastName && !this.checkLenghtOfString(input.lastName, 100)) {
      throw new BadRequestException('El apellido no puede exceder los 100 caracteres.');
    }

    const existingUser = json.users[userIndex];
    json.users[userIndex] = {
      ...existingUser,
      ...input,
      idUser: existingUser.idUser,
      phone: input.phone ?? existingUser.phone,
    };

    this.saveFile(json);
    return json.users[userIndex];
  }

  removeUserById(id: number): User {
    const json = this.readFile();

    if (!this.existUserById(id)) {
      throw new NotFoundException('No se encontró un usuario con el ID ' + id);
    }

    const userIndex = json.users.findIndex((usr) => usr.idUser === id);
    const deletedUser = json.users[userIndex];
    json.users.splice(userIndex, 1);
    
    this.saveFile(json);
    return deletedUser;
  }
}
