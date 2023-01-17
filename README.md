# The Guest and Chatbook

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Get Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js v 18](https://nodejs.org/en/). Just run `nvm use` to use the correct version.
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. To get started, clone the repository and run `npm install` in the root.
2. Copy `.env.example`, rename it to `.env`.
3. `DATABASE_URL` is the connection string to your database. Just use `DATABASE_URL=postgresql://conuko:conuko@localhost:5433/guest_and_chat_book` for now.
4. For authentication paste your Discord client ID and secret in `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` (same goes for GitHub). You can get these from the [Discord Developer Portal](https://discord.com/developers/applications).
5. Run `npm run docker:up` to start the database.
6. Run `npx prisma db push` to push the schema to your database.
7. Run `npm run db:seed` to seed the database (OPTIONAL).
8. Run `npm run dev` to start the development server.
9. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
10. Run `npx prisma studio` to open the Prisma Studio to view your database.
11. Run `npm run docker:down` to stop the database when you’re done. This will also delete all the data in your database.

### Testing

1. Before running the tests, make sure you have the database running with `npm run docker:up`. Also make sure you have the database seeded with `npm run db:seed`.
2. Run `npm run test` to run the tests.

## Application Overview

- `prisma/*` - The prisma schema.
- `public/*` - Static assets including fonts and images.
- `src/env/*` - Validation for environment variables.
- `src/pages/*` - All the pages of the website.
- `src/server/*` - The backend, which is a tRPC server.
- `src/styles/*` - Global CSS files, but we’re going to be using Tailwind CSS for most of our styles.
- `src/types/*` - Next Auth type declarations.
- `src/utils/*` - Utility functions.

## Deployment

This project is deployed on [Vercel](https://vercel.com). Here is a step by step guide on how to deploy the project to Vercel:

1. Create a new project on Vercel and link it to your GitHub repository.
2. Add the following environment variables to your Vercel project:
   - `DATABASE_URL` - Your database connection string (You can use [Railway](https://railway.app/) to get a free online PostgreSQL database in under 5 minutes.)
   - `DISCORD_CLIENT_ID` - Your Discord client ID.
   - `DISCORD_CLIENT_SECRET` - Your Discord client secret.
   - `NEXTAUTH_SECRET` - A secret for NextAuth.js.
   - `GITHUB_SECRET` - A GitHub client secret.
   - `GITHUB_ID` - A GitHub client ID.
3. Deploy your project to Vercel.

Please refer to the [Vercel documentation](https://vercel.com/docs/concepts/deployments/overview) for more information on how to deploy your Next.js project to Vercel.

## Built With

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TypeScript](https://www.typescriptlang.org)
- [Vercel](https://vercel.com)
- [Docker](https://www.docker.com)
- [PostgreSQL](https://www.postgresql.org)
- [Vitest](https://vitest.dev)
