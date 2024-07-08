# JWT + DB Session Auth Backend

This is an effort to fix JWTs biggest problem, which is invalidating tokens.

## Index

- [Flowcharts](#flowcharts)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- - [Why prisma?](#why-prisma-for-the-db)
- [Useful resources](#useful-resources)

## Flowcharts

![Log In ceremony](https://i.imgur.com/wSZLeYJ.png)
![Middleware](https://i.imgur.com/GGYkq2j.png)

## Project Structure

```
.
├── Backend   <-- Authentication Server
└── Frontend  <-- A simple nextjs app to showcase the authentication
```

## Tech Stack

**Backend**: ExpressJS, Prisma, SQLite</br>
**Frontend**: NextJS

### Why prisma for the db?

The database is managed with the prisma ORM, I made this choice since i plan to use this with real world projects and using an ORM it's the safest way to interact with a database on the server, plus if I want to use another db technology than sqlite I can easily switch to it (You can read more [here](https://blog.bitsrc.io/what-is-an-orm-and-why-you-should-use-it-b2b6f75f5e2a)).
