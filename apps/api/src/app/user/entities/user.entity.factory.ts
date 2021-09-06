import { Role, User } from './user.entity';
import * as Faker from 'faker';
import { Factory, Seeder, define } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as argon2 from 'argon2';
import { AuthType } from '../../auth/dto/user.social.data';
interface IUserContext {
  authType: AuthType;
  role: Role;
  password: string;
  email: string;
}
define(User, (faker: typeof Faker, context: IUserContext) => {
  const { authType, role, password, email } = context;
  let userData;
  const name = faker.name.findName();
  if (authType === 'local') {
    if (role === 'admin')
      userData = {
        email: email,
        name: faker.internet.userName(name),
        passwordHash: argon2.hash(password),
        authType: authType,
        role: role,
      };
    else {
      userData = {
        email: Faker.internet.email(name),
        name: faker.internet.userName(name),
        passwordHash: argon2.hash(faker.internet.password()),
        authType: authType,
        role: role,
      };
    }
  } else {
    userData = {
      email: faker.internet.email(name),
      name: faker.internet.userName(name),
      authType: authType,
      socialId: Faker.datatype.uuid(),
    };
  }
  const user = new User(userData);
  return user;
});
