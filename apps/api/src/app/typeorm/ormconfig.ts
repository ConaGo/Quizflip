import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';
import { DriverQuestion } from '../question/entities/driverQuestion.entity';
import { Question } from '../question/entities/question.entity';
import { UserToQuestionStats } from '../question/entities/userToQuestionStats.entity';
import { User } from '../user/entities/user.entity';
//import {User UserToQuestionStats, Question, DriverQuestion} from '../'

type ConnectionOptiosWithSeeding = ConnectionOptions & {
  seeds: string[];
  factories: string[];
};
export const ormconfig: (
  configService: ConfigService
) => ConnectionOptiosWithSeeding = (configService) => {
  const config: ConnectionOptiosWithSeeding = {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    //can be set explicitly or automatic
    entities: [User, Question, DriverQuestion, UserToQuestionStats],
    //entities: [__dirname + '/../**/*.entity.ts'],
    synchronize: true,

    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: true,
    logging: 'all',
    logger: 'file',

    // allow both start:prod and start:dev to use migrations
    // __dirname is either dist or src folder, meaning either
    // the compiled js in prod or the ts in dev
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    seeds: [__dirname + '/../**/*.entity.seed.ts'],
    factories: [__dirname + '/../**/*.entity.factory.ts'],
  };
  return config;
};
