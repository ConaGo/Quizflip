import { User } from './user.entity';
import * as Faker from 'faker';
import { Factory, Seeder, define } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as argon2 from 'argon2';

define(User, (faker: typeof Faker, context: { authType }) => {
  let userData;
  const name = faker.name.findName();
  if (context.authType === 'local') {
    userData = {
      email: Faker.internet.email(name),
      name: faker.internet.userName(name),
      passwordHash: argon2.hash(faker.internet.password()),
    };
  } else {
    userData = {
      email: faker.internet.email(name),
      name: faker.internet.userName(name),
      authType: context.authType,
      socialId: Faker.datatype.uuid(),
    };
  }
  const user = new User(userData);
  return user;
});
