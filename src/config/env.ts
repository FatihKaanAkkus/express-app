import 'dotenv/config';

interface EnvProps {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
}

const defaultEnv: EnvProps = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./database/db.sqlite',
};

if (!process.env.PORT) {
  console.warn(`PORT is not defined in .env file, using default "${defaultEnv.PORT}"`);
}
if (!process.env.NODE_ENV) {
  console.warn(`NODE_ENV is not defined in .env file, using default "${defaultEnv.NODE_ENV}"`);
}
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in .env file');
}

class Env {
  get<T>(key: keyof typeof defaultEnv, defaultValue?: T): T {
    return (defaultEnv[key] ?? defaultValue) as T;
  }
}

const env = new Env();

export default env;
