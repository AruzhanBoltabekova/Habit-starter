# Habit Tracker App 

Data schema `./prisma/schema.prisma`

![dbschema.svg](dbschema.svg)

## User

According to the given diagram, the following relationships between the models can be defined:

**1. One to many (1:N):**

- **User - Habit**: One user can have many habits.
- **Habit - Record:** One habit can have many records.

**3. Many to one (N:1):**

- Habit - User: Many habits belong to one user.
- Record - Habit: Many records belong to the same habit.

**4. Cascade deletion:**

- Deleting a user (User): When deleting a user, all his habits and records
- Deleting a Habit: Deleting a habit deletes all its records.

**5. Safe deletion:**

- Deleting records: Deleting a record does not delete the habit or user.

## API Endpoints

- / - reserved for the frontend   
- /auth/login GET - login form
- /auth/login POST, body: email, password. Returns JWT token
- /auth/register GET - register form
- /auth/register POST, body: email, password. Returns JWT token & creates a db user record
- /habits GET - list of habits
- /logout GET - logout. Clears the session and JWT token from the cookie


```typescript
app.use("/api/habit", isAuthenticated, createRouter((router) => {
  router.get("/deleteme", deleteMyUser);
  router.get("/", getHabitsHandler);
  router.get("/ids", getHabitIdsHandler);
  router.get("/categories", getGroupedHabits);
  router.get("/:id", getSpecificHabitHandler);
  router.post("/", createHabitHandler);
  router.delete("/:id", deleteHabitHandler);
}));
```

- /api/record/:id POST - create a record
- /api/record/:id DELETE - delete a record

- /api/ !! legacy docs

## Steps to run the project

```shell
# Create a postgres database and user or edit the DATABASE_URL in .env
brew install postgresql@14
createuser -s postgres
createdb 'habits'

# Install Bun for easy TS run
curl -fsSL https://bun.sh/install | bash

# list databases
# psql -U postgres -l
```
Postgres cheatsheet: - https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3

```shell
# Run with Bun
bun dev

# Import the DB schema !!! target db must be empty
npx prisma db push

# Seed the data to the DB
```

## Demo data

```dotenv
email=admin@example.com
JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzE4MzgyODU4LCJleHAiOjIzMjMxODI4NTh9.kRaB2snNYDndWq27oim7hRR5yEUJDFiC2vqgcgKz5J8
password=password
```
