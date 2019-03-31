import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../entity/User';

export class CreateAdminUser1553864329367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = getRepository(User);
    const user = userRepository.create({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: 'ADMIN'
    });
    await user.hashPassword();

    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}

