import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { NotFoundError, ConflictError } from '../../errors/app-error.js';
import type { CreateUserInput, UserResponse } from './users.routes.js';

export class UsersService {
  static async findAll(): Promise<UserResponse[]> {
    return db.select().from(users);
  }

  static async findById(id: string): Promise<UserResponse> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  static async create(input: CreateUserInput): Promise<UserResponse> {
    const [existing] = await db.select().from(users).where(eq(users.email, input.email));
    if (existing) {
      throw new ConflictError(`User with email ${input.email} already exists`);
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
      })
      .returning();

    return newUser;
  }
}
