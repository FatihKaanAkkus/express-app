# Express App Description (Quick Draft)

This file contains basic draft information about the construction of this application and the technologies
used to give an idea of the implementation required.

## What it is?

@todo

## Technologies

- Environment is `Node.js`.
  - Minimum version is `20.17.0` for development.
- Language is `TypeScript`.
- Package manager is `npm`.
- Framework is `Express.js`.
- Database is `SQLite3` using `Prisma ORM` for portability reasons.
  - Adaptable to other relational databases supported by Prisma.
  - Tables are created using Prisma migrations.
- Validation is done using `Zod`.
- Caching is done using `cache-manager`.
  - Under the hood, it uses Keyv by default. Configurable to use Redis or other supported stores.
- Production build generated using `tsc` with target `ES2020`.
  - Compiler paths are resolved using `tsc-alias` within build script.

## Expected Inputs and Outputs

@todo

## Resources

- `users`: Users of the system.

## Relationships

@todo
