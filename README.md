# JWT + DB Session Auth Backend

This is an effort to fix JWTs biggest problem, which is invalidating tokens.

## UI Preview
![Frontend Preview](https://i.imgur.com/FKB6g9A.png)

## Index

- [Flowcharts](#flowcharts)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- - [Why prisma?](#why-prisma-for-the-db)
- [Running it](#running-it)

## Flowcharts

![Log In ceremony](https://i.imgur.com/DmlI1Fn.png)
![Middleware](https://i.imgur.com/GGYkq2j.png)

## Project Structure

```
.
├── Backend   <-- Authentication Server
└── Frontend  <-- A simple nextjs app to showcase the authentication
```

## Tech Stack

**Backend**: ExpressJS, bcrypt, prisma, SQLite</br>
**Frontend**: NextJS

### Why prisma for the db?

The database is managed with the prisma ORM, I made this choice since I plan to use this with real world projects and using an ORM it's the safest way to interact with a database on the server, plus if I want to use another db technology than sqlite I can easily switch to it (You can read more [here](https://blog.bitsrc.io/what-is-an-orm-and-why-you-should-use-it-b2b6f75f5e2a)).

## Running it
With docker running this project is really simple:

1. Rename the .env.example to .env, this file should already be configured to be working in a development environment, if you are planning to use this in production, please check every option in that file

2. Run the following command in the root (/) of the project
```bash
docker compose up
```

3. To stop the project you can stop it with the following command
```bash
docker compose down
```
