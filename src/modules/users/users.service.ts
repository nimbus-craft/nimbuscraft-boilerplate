import { NotFoundError, ConflictError } from '../../errors/app-error.js';
import type { CreateUserInput, UserResponse } from './users.schemas.js';
import { randomUUID } from 'node:crypto';

// In-memory repository fallback for testing and development without live DB
const memoryUsersStore: UserResponse[] = [];

export class UsersService {
  static async findAll(): Promise<UserResponse[]> {
    return memoryUsersStore;
  }

  static async findById(id: string): Promise<UserResponse> {
    const user = memoryUsersStore.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  static async create(input: CreateUserInput): Promise<UserResponse> {
    const existing = memoryUsersStore.find((u) => u.email === input.email);
    if (existing) {
      throw new ConflictError(`User with email ${input.email} already exists`);
    }

    const newUser: UserResponse = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryUsersStore.push(newUser);
    return newUser;
  }
}
