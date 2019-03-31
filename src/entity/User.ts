import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  getRepository,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  username: string;

  @Column()
  @Length(4, 254)
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Hashes the password using bcrypt
   */
  async hashPassword() {
    // we're using the async hash and comparison functions
    // so we don't block the server for too long
    this.password = await bcrypt.hash(this.password, 10);
  }

  /**
   * Checks if plain, non-encrypted password matches the encrypted one
   * @param {string} nonEncryptedPassword
   * @returns {Promise<boolean>} - true if
   */
  async isNonEncryptedPasswordValid(
    nonEncryptedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(nonEncryptedPassword, this.password);
  }
}

export const getUserRepository = () => getRepository(User);
