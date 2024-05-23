import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'postgres';
}

const development: DBConfig = {
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  dialect: 'postgres',
};


const config = {
  development,
};

export default config;
