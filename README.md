# Express App

This project is a REST API server built with Express, Prisma ORM, and Zod.

> ⚠️ Please refer to the `DESCRIPTION.md` file for a draft description of the application.

To get started, follow the instructions below to set up the project on your local machine.

## Project Structure

```
|-- src/
│   |-- app.ts                 # Main application entry point
│   |-- config/
│   │   |-- cache.ts           # Cache configuration using cache-manager
│   │   |-- env.ts             # Environment configuration
│   |-- controllers/           # Controller for resource related operations
│   │   |-- user-controller.ts
│   |-- database/              # Database related files
│   │   |-- prisma-client.ts
│   │   |-- seeders/
│   |-- generated/
│   │   |-- prisma/            # Generated Prisma client folder
│   |-- helpers/               # Helper functions/modules
│   │   |-- cache-keys.ts
│   |-- middlewares/           # Middlewares for express application
│   │   |-- check-cached-resource.ts
│   │   |-- error-handler.ts
│   │   |-- validate-user.ts
│   |-- routes/                # Routes for resource related endpoints
│   │   |-- user-routes.ts
|   |-- tests/                 # Tests folder for vitest
|   |   |-- setup.ts
|   |   |-- routes/
│   |-- validators/            # Zod schemas for resource validation
│       |-- user-schemas.ts
|-- prisma/
│   |-- schema.prisma          # Prisma schema file
│   |-- migrations/            # Prisma migration files
|-- .editorconfig
|-- .env
|-- .env.example               # Should populate .env file from this example
|-- .gitignore
|-- package.json
|-- tsconfig.json
|-- vitest.config.ts
```

## Setup Instructions

1. Clone the repository or download the source code.

2. Navigate to the project directory.

3. Install the dependencies using npm:

```bash
npm install
```

4. Create a `.env` file in the root directory. Use `.env.example` as a template.

5. Run the following command to migrate the database:

```bash
npx prisma migrate dev --name init --skip-seed
```

6. Additionally, you can seed the database with initial data from Postman collection:

```bash
npx prisma db seed
```

7. Start the dev server:

```bash
npm run dev
```

8. Access the API at `http://localhost:3000` or configured PORT in .env file.

9. Use `vitest` to test the API endpoints.

```bash
npm run test
```

10. For production build, run:

```bash
npm run build
```

11. Start the production server:

```bash
npm start
```

## Additional Information

### Data Definition

- The database schema is defined in the `prisma/schema.prisma` file.
  - The format is defined by Prisma.
- Migration files for the database are located under `prisma/migrations/`.

## Improve Later

- Add cross-env to the project, or similar, to set the environment for local testing.
- Add Prisma migration compare/genereate command to package.json since it is lots to remember.
- Production build should include `dist/`, `prisma/`, `.env.example`, `package.json` and
  `package-lock.json` files only.
