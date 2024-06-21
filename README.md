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

```typescript
// API documentation route
app.get("/api", (req, res) => {res.status(200).json(DOCS)});

// User login route
// app.get("/login", login.get);
app.post("/api/login", login.post);

// User registration route
// app.get("/register", register.get);
app.post("/api/register", register.post);

// User-authenticated routes
// User logout route
app.get("/api/logout", isAuth, logout);

// Habit routes
app.use("/api/habit", isAuth, createRouter((router) => {
  // List of user's habits
  router.get("/", habit.GET);
  router.get("/ids", habit.GET_IDS);
  router.get("/categories", habit.GET_CATEGORY);

  // Create a new habit
  router.put("/", habit.PUT);

  // Specific habit routes
  router.get("/:id", habit.GET_BY_ID);
  router.delete("/:id", habit.DELETE_BY_ID);
  router.patch("/:id", habit.PATCH_BY_ID);
}));

// Record routes
app.use("/api/record", isAuth, createRouter((router) => {
  // Get records
  router.get("/", record.GET_ALL); // List of all user's records
  router.get("/:id", record.GET_BY_ID); // Specific record
  router.get("/habit/:id", record.GET_BY_HABIT_ID); // Specific habit's records

  // Delete a record by ID
  router.delete("/:id", record.DELETE_BY_ID); // Delete a record

  // Post a record for a specific habit
  router.put("/habit/:id", record.PUT_BY_HABIT_ID); // Create a record
}));
```


## Build server && Run

```shell
bun build src/server.ts --target=bun --outfile=dist/server.js
node dist/server.js
```

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
