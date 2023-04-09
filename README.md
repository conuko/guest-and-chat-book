# The Guest and Chatbook

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Get Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js v 18](https://nodejs.org/en/). Just run `nvm use` to use the correct version.
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Stripe](https://stripe.com) CLI installed globally (`npm i -g stripe`)

### Installation

1. To get started, clone the repository and run `npm install` in the root.
2. Copy `.env.example`, rename it to `.env`.
3. `DATABASE_URL` is the connection string to your database. Just use `DATABASE_URL=mysql://root:password@localhost:3306/testdb` for now.
4. For authentication paste your Discord client ID and secret in `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` (same goes for GitHub). You can get these from the [Discord Developer Portal](https://discord.com/developers/applications).
5. Run `npm run docker:up` to start the database.
6. Run `npx prisma db push` to push the schema to your database.
7. Run `npm run db:seed` to seed the database (OPTIONAL).
8. Run `npm run dev` to start the development server.
9. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
10. Run `npx prisma studio` to open the Prisma Studio to view your database.
11. Run `npm run docker:down` to stop the database when you’re done. This will also delete all the data in your database.

### Stripe Local Setup

1. Install the Stripe CLI by running `npm install -g stripe`.
2. Run `stripe login` and follow the prompts to connect your Stripe account.
3. Run `npm run stripe:listen` to start the Stripe CLI.
4. In your .env file, add the following environment variables:
   - `STRIPE_PK`
   - `STRIPE_SK`
   - `STRIPE_WEBHOOK_SECRET` - The webhook secret provided by the Stripe CLI.
   - `STRIPE_PRICE_ID` - The price ID of your Stripe product.
5. To test Stripe you can use the following test card numbers:
   - `4242 4242 4242 4242` - A successful payment.
   - `4000 0000 0000 0002` - Declined payment.
   - `4000 0000 0000 9995` - Declined payment, insufficient funds.
   - For more test card numbers, refer to the [Stripe documentation](https://stripe.com/docs/testing#cards).

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
   - `DATABASE_URL` - Your database connection string (You can use [Planet Scale](https://planetscale.com/) to get a free online MySQL database in under 5 minutes.)
   - `DISCORD_CLIENT_ID` - Your Discord client ID.
   - `DISCORD_CLIENT_SECRET` - Your Discord client secret.
   - `NEXTAUTH_SECRET` - A secret for NextAuth.js.
   - `GITHUB_SECRET` - A GitHub client secret.
   - `GITHUB_ID` - A GitHub client ID.
3. Deploy your project to Vercel.
4. Create a `.env.production` file in the root of your project and add the `DATABASE_URL` environment variable of your production database (e.g. the database url from your database hosted on Planet Scale).
5. Run `npx prisma migrate dev` to to create a new migration.
6. You can now run `npm run prisma:migrate:deploy:prod` to apply the latest migration to your production database.

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
- [MySQL](https://www.mysql.com)
- [Stripe](https://stripe.com)
- [Vitest](https://vitest.dev)
