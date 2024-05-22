import { config as dotenvConfig } from 'dotenv';
import { Dialect } from 'sequelize';
dotenvConfig();

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  use_env_variable?: string;
}

interface Config {
  [key: string]: DbConfig;
}

const config: Config = {
  development: {
    username: 'postgres',
    password: 'root',
    database: 'user_appointment',
    host: '127.0.0.1',
    dialect: 'postgres' as Dialect,
  }
};

export default config;
