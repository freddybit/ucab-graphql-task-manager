import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { IUsersRepository } from './interfaces/user-repository.interface';
import * as path from 'path';
import { UserFile } from './interfaces/user-file.interface';
import * as fs from 'fs';
import { json } from 'stream/consumers';

@Injectable()
export class UsersRepository implements IUsersRepository {
	private readonly filePath: string = path.join(
		process.cwd(),
		'data',
		'users-data.json',
	);

	constructor() {}

	private readFile(): UserFile {
		const fileContent = fs.readFileSync(this.filePath, 'utf-8');
		return JSON.parse(fileContent) as UserFile;
	}

	private saveFile(data: UserFile): void {
		fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
	}

	onModuleInit() {
		const directory = path.dirname(this.filePath);

		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory, { recursive: true });
		}

		if (!fs.existsSync(this.filePath)) {
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

	getAllUsers(): User[] {
		return this.readFile().users;
	}

	getUserById(id: number): User | undefined {
		return this.readFile().users.find((user: User) => user.idUser === id)
	}

	updateUser(id: number, input: UpdateUserInput): User | undefined {
    const json = this.readFile();
    const userIndex = json.users.findIndex((user) => user.idUser == id);

    if (userIndex === -1) {
      throw new NotFoundException(
        'No se encontró un usuario con el ID ' + id,
      );
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

	deleteUser(id: number): boolean {
    const json = this.readFile();

    if (!this.existUserById(id)) {
      throw new NotFoundException('No se encontró un usuario con el ID ' + id);
    }

    const userIndex = json.users.findIndex((usr) => usr.idUser === id);
    const deletedUser = json.users[userIndex];
    json.users.splice(userIndex, 1);

    this.saveFile(json);
    return true;
	}
}
