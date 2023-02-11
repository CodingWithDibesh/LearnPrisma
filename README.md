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
