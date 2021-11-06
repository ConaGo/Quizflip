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
  name: string;
}
define(User, (faker: typeof Faker, context: IUserContext) => {
  const { authType, role, password, email } = context;
  let { name } = context;
  let userData;
  if (!name) name = faker.name.findName();
  if (authType === 'local') {
    if (role === 'admin')
      userData = {
        email: email,
        name: name,
        passwordHash: argon2.hash(password),
        authType: authType,
        role: role,
      };
    else {
      userData = {
        email: Faker.internet.email(name),
        name: name,
        passwordHash: argon2.hash(password || faker.internet.password()),
        authType: authType,
        role: 'user',
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
