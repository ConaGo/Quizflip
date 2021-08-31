import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from './user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(User)({ authType: 'local', role: 'admin' }).create();
    await factory(User)({ authType: 'local' }).createMany(50);
    await factory(User)({ authType: 'github' }).createMany(25);
    await factory(User)({ authType: 'google' }).createMany(25);
  }
}
