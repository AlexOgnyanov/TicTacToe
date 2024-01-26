import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';

import { UserTypes } from '@/users/enums';
import { UserTypeEntity } from '@/users/entities';

export const userTypesSeed = [
  {
    id: 1,
    name: UserTypes.User,
  },
  {
    id: 2,
    name: UserTypes.Admin,
  },
];

export default class UserTypesSeeder extends Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    return await dataSource.getRepository(UserTypeEntity).save(userTypesSeed);
  }
}
