import 'dotenv/config';

interface EnvProps {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
  JWT_EXPIRES_IN: string;
}

const defaultEnv: EnvProps = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./database/db.sqlite',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_ISSUER: process.env.JWT_ISSUER || '',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
};

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
