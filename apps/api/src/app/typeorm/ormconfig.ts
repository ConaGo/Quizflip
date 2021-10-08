import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';
import { DriverQuestion } from '../question/entities/driverQuestion.entity';
import { Question } from '../question/entities/question.entity';
import { UserToQuestionStats } from '../question/entities/userToQuestionStats.entity';
import { User } from '../user/entities/user.entity';
//import {User UserToQuestionStats, Question, DriverQuestion} from '../'

export const ormconfig: (configService: ConfigService) => ConnectionOptions = (
  configService
) => {
  const config: ConnectionOptions = {
    type: 'postgres',
    host: configService.get(envChecker('DB_HOST')),
    port: configService.get(envChecker('DB_PORT')),
    username: configService.get(envChecker('DB_USERNAME')),
    password: configService.get(envChecker('DB_PASSWORD')),
    database: configService.get(envChecker('DB_NAME')),
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
  };
  return config;
};

const envChecker = (s: string) => {
  if (process.env.NODE_ENV === 'test') return 'TEST_' + s;
  else return s;
};
