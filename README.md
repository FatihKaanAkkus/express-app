# Express App

This project is a REST API server built with Express, Prisma ORM, and Zod.

> ⚠️ Please refer to the `DESCRIPTION.md` file for a draft description of the application.

To get started, follow the instructions below to set up the project on your local machine.

## Project Structure

```
|-- src/
│   |-- config/                # Configuration files
│   |-- controllers/           # Controller for resource related operations
│   |-- database/              # Database related files
│   │   |-- seeders/
│   │   |-- prisma-client.ts
│   |-- generated/
│   │   |-- prisma/            # Generated Prisma client folder
│   |-- helpers/               # Helper functions/modules
│   |-- middlewares/           # Middlewares for express application
│   |-- routes/                # Routes for resource related endpoints
│   │   |-- v1/
│   │-- services/              # Services for resource related operations
|   |-- tests/                 # Tests folder for vitest
|   |   |-- routes/
|   |   |-- setup.ts
│   |-- validators/            # Zod schemas for resource validation
│   |-- app.ts                 # Application entry point
|   |-- server.ts              # Server entry point
|-- prisma/
│   |-- schema.prisma          # Prisma schema file
│   |-- migrations/            # Prisma migration files
|-- .dockerignore
|-- .editorconfig
|-- .env
|-- .env.example               # Should populate .env file from this example
|-- .gitignore
|-- compose.yaml               # Docker compose file for the application
|-- compose.grafana.yaml       # Docker compose file for the Grafana setup
|-- Dockerfile                 # Dockerfile for containerizing the application
|-- package.json
|-- prometheus.yml             # Prometheus configuration file
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

6. Additionally, you can seed the database with random data using seed files:

   ```bash
   npx prisma db seed
   ```

7. Start the dev server:

   ```bash
   npm run dev
   ```

8. Access the API at `http://localhost:3001` or configured PORT in .env file.

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
- Add Prisma migration compare/generate command to package.json since it is lots to remember.
- Production build should include `dist/`, `prisma/`, `.env.example`, `package.json` and
  `package-lock.json` files only.

## Docker Setup

- Make sure to create a Docker network named `monitoring-net` before running the compose file:

  ```bash
  docker network create monitoring-net
  ```

- Use `compose.yaml` to set up the application with Prometheus monitoring.

  ```bash
  docker-compose -f compose.yaml up -d
  ```

- Use `compose.grafana.yaml` to set up Grafana for visualization.

  ```bash
  docker-compose -f compose.grafana.yaml up -d
  ```

- Or use both together:

  ```bash
  docker-compose -f compose.yaml -f compose.grafana.yaml up -d
  ```
