# T3 Guestbook

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Get Started

1. To get started, clone the repository and run `npm install` in the root.
2. Copy `.env.example`, rename it to `.env`, and paste your databse connection string in `DATABASE_URL`. For authentication paste your Discord client ID and secret in `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`. You can get these from the [Discord Developer Portal](https://discord.com/developers/applications). I set up my postgres database on [Railway](https://railway.app/)
3. Run `npx prisma db push` to push the schema to your database.
4. Run `npm run dev` to start the development server.
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
6. Run `npx prisma studio` to open the Prisma Studio to view your database.

## Application Overview

- `prisma/*` - The prisma schema.
- `public/*` - Static assets including fonts and images.
- `src/env/*` - Validation for environment variables.
- `src/pages/*` - All the pages of the website.
- `src/server/*` - The backend, which is a tRPC server.
- `src/styles/*` - Global CSS files, but we’re going to be using Tailwind CSS for most of our styles.
- `src/types/*` - Next Auth type declarations.
- `src/utils/*` - Utility functions.

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
