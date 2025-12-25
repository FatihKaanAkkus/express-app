import 'dotenv/config';

interface Env {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
}

const env: Env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./database/db.sqlite',
};

if (!process.env.PORT) {
  console.warn(`PORT is not defined in .env file, using default "${env.PORT}"`);
}
if (!process.env.NODE_ENV) {
  console.warn(`NODE_ENV is not defined in .env file, using default "${env.NODE_ENV}"`);
}
if (!process.env.DATABASE_URL) {
  console.warn(`DATABASE_URL is not defined in .env file, using default "${env.DATABASE_URL}"`);
}

export default env;
