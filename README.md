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

Before we start using prisma client lets create a `index.ts` file on root directory so that we can invoke all the required functions from there. We are trying to mimic a function call but since we are not creating a rest api we will be using `console.log` to print the output.

### Setting up index.ts file

Lets create a `index.ts` file on root directory and add the following code.

```ts
// Path: index.ts
console.log("APP: Application Started");

const executor = async () => {
    
}

executor()
.then()
.catch()
.finally(()=>{
    console.log("APP: Application Ended");
})
```

When you run `yarn ts-node index.ts` command you will see the following output.

```bash
APP: Application Started
APP: Application Ended
Done in 3.92s.
```

Lets create a dev command on `package.json` file to run the application. Add the following code to `package.json` file.

```json
{
  "scripts": {
    "dev": "ts-node index.ts"
  }
}
```

Now you can run `yarn dev` command to run the application.

### Creating common Prisma Error Handler

Lets also create a common error handler that will be used to handle all the prisma errors. Create a `Tables` directory and inside inside that directory, create a `PrismaError.ts` file and add the following code.

```ts
// Path: Tables\PrismaError.ts

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const handelPrismaError = (
 error: PrismaClientKnownRequestError
): string => {
 switch (error.code) {
  case "P2000":
   return `The ${error.meta?.column_name} is too long. `;
  case "P2001":
   return `No records found for the ${error.meta?.target}`;
  case "P2002":
   return `Unique constraint failed on the ${error.meta?.target}`;
  case "P2003":
   return `Foreign key constraint failed on the ${error.meta?.target}`;
  case "P2004":
   return `The ${error.meta?.target} already exists`;
  default:
   return "Something went wrong";
 }
};
```

Here we are handling all the prisma errors and returning a custom error message. You can customize the error message as per your requirement.

### Creating User Handler

After setting up the `index.ts` file lets create a `UserTable.ts` file that will contain all the functions related to user. Create a directory named `Tabes` on root directory and create a `UserTable.ts` file inside it. Add the following code to `UserTable.ts` file.

```ts
// Path: Tables\UserTable.ts

export class UserTable {
 static create = async () => {};
 static update = async () => {};
 static delete = async () => {};
 static getAll = async () => {};
 static getById = async () => {};
}

```

#### Create User

Now lets import prisma client and implement the create function first. Our create function will take only few arguments and will return the created user. Add the following code to `UserTable.ts` file.

```ts
// Path: Tables\UserTable.ts

import { PrismaClient } from "@prisma/client";
import { handelPrismaError } from "./PrismaError";
const prisma = new PrismaClient();

interface ICreateUser {
 email: string;
 password: string;
 phoneNumber: string;
}

export class UserTable {
 static create = async (newUser: ICreateUser) => {
  try {
   const user = await prisma.user.create({
    data: {
     ...newUser,
    },
   });
   return { user };
  } catch (e: any) {
   return { error: handelPrismaError(e) };
  }
 };
....
}
```

#### Update User

Lets implement update functions. Add the following code to `UserTable.ts` file.

```ts
import { PrismaClient,User } from "@prisma/client";
...

export class UserTable{
  ...
  static update = async (updateUser: User) => {
        try {
            const user = await prisma.user.update({
                where: {
                    id: updateUser.id,
                },
                data: {
                    ...updateUser,
                },
            });
            return { user };
        }
        catch (e: any) {
            return { error: handelPrismaError(e) };
        }
    };
    ...
}
```

#### Delete User

Lets implement delete functions. Add the following code to `UserTable.ts` file.

```ts

...

export class UserTable{
  ...
 static delete = async (user: User) => {
  try {
   const deletedUser = await prisma.user.delete({
    where: {
     id: user.id,
    },
   });
   return { deletedUser };
  } catch (e: any) {
   return { error: handelPrismaError(e) };
  }
 };
    ...
}
```

#### Get All Users

Lets implement get all users functions. Add the following code to `UserTable.ts` file.

```ts
...

export class UserTable{
  ...
 static getAll = async (includeProfile: boolean = false) => {
  try {
   const users = await prisma.user.findMany({
    include: {
     profile: includeProfile,
    },
   });
   return { users };
  } catch (e: any) {
   return { error: handelPrismaError(e) };
  }
 };
...
}
```

#### Get User By Id

Finally lets implement get user by id functions. Add the following code to `UserTable.ts` file.

```ts
...

export class UserTable{
  ...

    static getById = async (id: string,includeProfile: boolean = false) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    profile: includeProfile,
                },
            });
            return { user };
        }catch (e: any) {
            return { error: handelPrismaError(e) };
        }
    };
...
}
```

### Using User Handler

Now lets use the user handler in our `index.ts` file. Add the following code to `index.ts` file.

```ts
...
import { UserTable } from "./Tables/UserTable";
...
const executor = async () => {
 const UsersList = await (await UserTable.getAll()).users;
 if (UsersList && UsersList.length === 0)
  console.log(
   "APP: Creating a new user",
   // Creating a new user
   await UserTable.create({
    email: "test@Test.com",
    password: "password",
    phoneNumber: "+977-9000000012",
   })
  );
 const UpdatedList = await (await UserTable.getAll()).users;
 console.log("APP: Users List", UpdatedList);
 if (UpdatedList && UpdatedList.length !== 0) {
  console.log(
   "APP: Updating the user",
   // Updating the user
   await UserTable.update({
    ...UpdatedList[0],
    password: "p@ssw0rd",
    isSuspended: true,
   })
  );
 }
 if (UpdatedList)
  console.log(
   "APP: Selecting First User From Db",
   // Selecting the user
   await UserTable.getById(UpdatedList[0].id)
  );
 if (UpdatedList)
  console.log(
   "APP: Deleting First User From Db",
   // Deleting the user
   await UserTable.delete(UpdatedList[0])
  );
 // Getting the final list
 const FinalList = await (await UserTable.getAll(true)).users;
 console.log("APP: Final Users List", FinalList);
};

...
```

Similarly you can create other tables and use them in your application.

## Conclusion

In a nutshell we have learned how to setup, create and use prisma and prisma client in our application. For further reading you can check out the [Prisma Documentation](https://www.prisma.io/docs/). If you have any questions or suggestions please feel free to comment below and hope you enjoyed exploring Prisma with me.
