'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, Options as SequelizeOptions } from 'sequelize';
import process from 'process';
import config from '../config/config'; // Adjust the path if necessary

// Extend the Sequelize Options interface to include use_env_variable
interface Options extends SequelizeOptions {
  use_env_variable?: string;
}

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig: Options = config[env as keyof typeof config];
const db: { [key: string]: any } = {};

let sequelize: Sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable] as string, dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database as string, dbConfig.username as string, dbConfig.password, dbConfig);
}

fs
  .readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts'
    );
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
