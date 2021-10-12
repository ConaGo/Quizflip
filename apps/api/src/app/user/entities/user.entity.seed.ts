import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from './user.entity';

export default class CreateUsers implements Seeder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(factory: Factory, _connection: Connection): Promise<void> {
    const env = process.env;
    if (env.ADMIN_EMAIL_1 && env.ADMIN_PW_1) {
      await factory(User)({
        authType: 'local',
        role: 'admin',
        email: env.ADMIN_EMAIL_1,
        password: env.ADMIN_PW_1,
      }).create();
    }
    if (env.ADMIN_EMAIL_2 && env.ADMIN_PW_2) {
      await factory(User)({
        authType: 'local',
        role: 'admin',
        email: env.ADMIN_EMAIL_2,
        password: env.ADMIN_PW_2,
      }).create();
    }
    if (env.ADMIN_EMAIL_3 && env.ADMIN_PW_3) {
      await factory(User)({
        authType: 'local',
        role: 'admin',
        email: env.ADMIN_EMAIL_3,
        password: env.ADMIN_PW_3,
      }).create();
    }
    await factory(User)({ authType: 'local' }).createMany(50);
    await factory(User)({ authType: 'github' }).createMany(25);
    await factory(User)({ authType: 'google' }).createMany(25);
  }
}
