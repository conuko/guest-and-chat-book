# The Guest and Chatbook

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

This project is a guestbook / twitter clone. It allows users to create, like, and comment posts.

## Table of Contents

1. [Get Started](#get-started)
2. [Features](#features)
3. [Application Overview](#application-overview)
4. [Architecture](#architecture)
5. [API Design](#api-design)
6. [Database Schema](#database-schema)
7. [Deployment](#deployment)
8. [Built With](#built-with)

## Features

- Authentication with Discord and GitHub.
- Create, read, edit, and delete posts: You can edit a post by clicking on the post. Edit and delete are only possible on your own posts.
- Like and unlike posts (only possible on other users posts).
- Comment on posts (only possible on other users posts), delete comments (only the author of the comment can delete it).
- Visit your user profile (by clicking on your username). (`/user` route)
- Add an address to your profile.
- Subscribe to a paid plan to unlock the ability to post messages (by clicking on the "Subscribe" button in the `/user` route). The subscription is handled by Stripe. The subscription is cancelled after 30 days. You can use the test credit card nuumber to test the subscription (see [Stripe Local Setup](#stripe-local-setup) below).

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
6. Run `npx prisma db push` to push the schema to your database and generate the TypeScript types for the Prisma Client based on your schema. Make sure to [restart the TS Server](https://tinytip.co/tips/vscode-restart-ts/) after this step so that it can detect the generated types.
7. Run `npm run db:seed` to seed the database (OPTIONAL).
8. Run `npm run dev` to start the development server.
9. Install and run Stripe by following [Stripe Local Setup](#stripe-local-setup) below (OPTIONAL).
10. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
11. Run `npx prisma studio` to open the Prisma Studio to view your database.
12. Run `npm run docker:down` to stop the database when you’re done. This will also delete all the data in your database.

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
   - For more test card numbers, refer to the [Stripe documentation](https://stripe.com/docs/testing#cards).

### Testing

1. Before running the tests, make sure you have the database running with `npm run docker:up`. Also make sure you have the database seeded with `npm run db:seed`.
2. Run `npm run test` to run the tests.

## Application Overview

### `libs`

The `libs` folder contains shared libraries for mocking and testing the backend (prisma and tRPC).

### `prisma`

The prisma schema. It contains the database schema and migrations. It also contains the seed data.

### `public`

Static assets.

### `src/components/`

React components.

### `src/env/`

Validation for environment variables.

### `src/pages/`

All the pages of the website.

#### `src/pages/api/`

Next.js API routes.

#### `src/pages/api/auth/[...nextauth].ts`

The NextAuth.js authentication slug route. This is used to authenticate users with Discord and GitHub (more providers can be added).

#### `src/pages/api/trpc/[trpc].ts`

The tRPC API entrypoint. This file is here to handle all the API requests.

### `src/server/`

The backend, which is a tRPC server. It contains the tRPC router, context, and the prisma client.

#### `src/server/common/get-server-auth-session.ts`

A helper function to get the user session from the NextAuth.js session.

#### `src/server/db/client.ts`

The prisma client. It is used to initialize the Prisma client at global scope and to query the database.

#### `src/server/stripe/`

The Stripe API. It contains the Stripe API client and the Stripe API routes. It also contains the Stripe webhook handler. The Stripe API routes are used to create a Stripe checkout session and to retrieve the Stripe customer.

#### `src/server/trpc/`

It contains the tRPC router with the tRPC queries and mutations. The tRPC router is used to initialize the tRPC router at global scope. The tRPC router is also used to handle the tRPC queries and mutations. The tRPC queries and mutations are used to retrieve and update data in the database. The tRPC queries and mutations are also used to retrieve and update data in the Stripe API.

### `src/styles/*`

Global CSS files, but we use Tailwind CSS for most of our styles.

### `src/types/*`

Next Auth type declarations.

### `src/utils/*`

Utility functions.

#### `src/utils/trpc.ts`

This file is the main front-end entrypoint to tRPC

## Architecture

### Frontend

The frontend is built with [Next.js](https://nextjs.org/). It uses [Tailwind CSS](https://tailwindcss.com/) for styling. It uses [tRPC](https://trpc.io/) for data fetching and state management. It uses [NextAuth.js](https://next-auth.js.org/) for authentication.

### Backend

The backend is built with [tRPC](https://trpc.io/) and [Typescript](https://www.typescriptlang.org/docs/handbook/). It uses [Prisma](https://www.prisma.io/) as an ORM with [Zod](https://github.com/colinhacks/zod) as schema validation. It uses [Tanstack Query](https://tanstack.com/query/v4/) for declarative, always-up-to-date and auto-managed queries and mutations. It uses [Stripe](https://stripe.com/) for payments. It uses [NextAuth.js](https://next-auth.js.org/) for authentication. It also uses [Docker](https://www.docker.com/) to quick and easy run the database locally.

#### tRPC

tRPC enables the creation of end-to-end typesafe APIs while eliminating code generation and runtime bloat. It takes advantage of TypeScript's excellent inference capabilities to deduce your API router's type definitions, providing complete typesafety and autocompletion when calling API procedures from your frontend.

#### Prisma

Prisma is a modern database toolkit. It replaces traditional ORMs and makes database access easy with an auto-generated query builder for TypeScript & Node.js.
By generating types from a Prisma schema, you can use Prisma Client to access your database inside your application’s TypeScript code with guaranteed type-safety and autocompletion.

#### Zod

Zod is a schema validation library built on top of Typescript. Write a schema that represents a single source of truth for your data, and Zod will ensure that your data is valid throughout your application, even across network boundaries and external APIs.

#### Stripe

Stripe is a payment processing platform. It is used to process payments for the website.

#### NextAuth.js

NextAuth.js is a complete open source authentication solution for Next.js applications. It is used to authenticate users with Discord and GitHub (more providers can be added) with a complex and secure OAuth flow.
NextAuth.js also provides a session management system with support for JWT and database sessions (Prisma is used for database sessions).

## API Design

## Database

![guestbook-db](https://user-images.githubusercontent.com/50672977/234784271-5410328a-8e2d-4471-965e-9e4c272aeda3.png)

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
