//This configuration is necessary for typeorm cli commands

//nx run api:drop-db
//runs
//schema:drop
const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //can be set explicitly or automatic
  //entities: [User, Question, DriverQuestion, UserToQuestionStats],
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: 'all',
  logger: 'file',

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  //migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  //cli: {
  //  migrationsDir: 'src/migrations',
  //},
  seeds: [__dirname + '/../**/*.entity.seed.ts'],
  factories: [__dirname + '/../**/*.entity.factory.ts'],
};
module.exports = config;
