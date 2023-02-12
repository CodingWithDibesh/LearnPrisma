# Learn Prisma

📓 Exploring Prisma as an ORM for Node Projects

## Setup Process

The Setup Process for Prisma is Divided into different phases as listed below.

1. Installing Dev Dependencies
2. Initializing TypeScript
3. Adding Prisma
4. Adding Prisma Client
5. Creating Database

### 1. Installing Dev Dependencies

To use Prisma ORM you need some of the core dependencies except prisma. Run `yarn add -D typescript ts-node @types/node` this will install root level packages as development dependency that prisma requires.

### 2. Initializing TypeScript

After we have installed dependencies we need to initialize typescript as Prisma is a TypeORM. Run `yarn tsc --init` command to initialize typescript. On successfully installation you will see a `tsconfig.json` on root directory.

### 3. Adding Prisma

After initializing typescript lets add prisma as dev dependency using `yarn add -D prisma`, so that we can now use prisma to define schema and start working.

### 4. Adding Prisma Client

Prisma client library is used to query the database so we will be needing it while consuming data from database. To add prisma client run `yarn add @prisma/client`

### 5. Creating Database

After completely adding up dependencies lets first create a database that can be used by prisma. I will be using `mysql` bust you can use any database of your choice.

1. Login to __mysql__ shell using `mysql -u root -p`, enter the password.
2. Run `CREATE DATABASE [dbName];` command.
3. Use `SHOW Databases;` command to verify the database.

For security reasons its better to create a new user and assign a basic privileges like `CREATE,READ,UPDATE,DELETE` but for now we wont be doing that.

## Creating Prisma Schema

After creating database we need to create a schema for prisma to use. Prisma schema is a file that defines the database schema and the models that can be used to query the database. Run `yarn prisma init --datasource-provider mysql` command to initialize prisma. This will create a `prisma` directory on root directory and a `schema.prisma` file inside it.

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

This is the default schema that is created by prisma. We will be modifying this schema to define our database schema and models.

You will also see a `.env` file at root of the directory that contains the database url. This is the url that prisma will use to connect to the database. You can change the database url to your database url.

```env
DATABASE_URL="mysql://johndoe:randompassword@localhost:3306/mydb"
```

Replace the database url with your database url.

## Creating Models

Now that we have created a database and a schema we can start defining our models. Open the `schema.prisma` file and add the following code.

```prisma
model User {
  id          String   @id @default(uuid()) // Primary Key and Default Value as UUID
  email       String   @unique // Unique Constraint
  password    String   @db.VarChar(60) // String with length 60 use bcrypt to hash password and store it
  phoneNumber String   @db.VarChar(15) // String with length 15
  isSuspended Boolean  @default(false) // Boolean with default value false
  isDeleted   Boolean  @default(false) // Boolean with default value false
  profile     Profile? // One To One Relation

  createdAt DateTime @default(now()) // DateTime with default value as now
  updatedAt DateTime @updatedAt // DateTime that will be updated on every update
}

model Profile {
  id        String  @id @default(uuid()) // Primary Key and Default Value as UUID
  userName  String  @unique @db.VarChar(7) // Allowed Characters -> A-Z,a-z,0-9 -> Total Possible Combination (26+26+9)^7
  isOnline  Boolean @default(false) // Boolean with default value false
  followers BigInt  @default(0) // BigInt with default value 0

  credential User   @relation(fields: [userId], references: [id], onDelete: Cascade) // On delete cascade
  userId     String @unique // One To One Relation

  tweets Tweet[] // One To Many Relation

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tweet {
  id          String          @id @default(uuid()) // Primary Key and Default Value as UUID
  description String
  access      AccessModifier? @default(PUBLIC) // Enum with default value PUBLIC

  Profile   Profile? @relation(fields: [profileId], references: [id], onDelete: Cascade)
  profileId String? 

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Access Modifier Enum
enum AccessModifier {
  PUBLIC
  PRIVATE
  SELF
}

```

After defining the models we need to migrate the database. Run `yarn prisma migrate dev` command to migrate the database. This will create a `migrations` directory that contains the migration files. You can also use `yarn prisma migrate dev --name [migrationName]` to name the migration.

## Generating Prisma Client

After defining the models we need to generate prisma client. Prisma client is the library that is used to query the database. Run `yarn prisma generate` command to generate prisma client. This will create a `node_modules/@prisma/client` directory that contains the prisma client library.

```bash
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (4.9.0 | library) to .\node_modules\@prisma\client in 293ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

Done in 4.59s.
```

## Using Prisma Client
