import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Conference } from '../entity/Conference';

export class AddFirstConference1553950268707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const conferenceRepository = getRepository(Conference);
    const conference = conferenceRepository.create({});
    await conferenceRepository.save(conference);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
