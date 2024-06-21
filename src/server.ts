import {APP_URL, DOCS, EXPRESS_CONFIG} from "@/config";
import isAuth from "@/middleware/isAuth";
import {login, logout, register} from "@/routes/auth";
import {habit} from "@/routes/habit";
import {record} from "@/routes/record";
import {createRouter} from "@/utils";
import {PrismaClient} from "@prisma/client";
import cors from "cors";
import errorHandler from "errorhandler";
import express from "express";
import session from "express-session";

// Initialize the Prisma client
export const prisma = new PrismaClient();

// Create the Express server
const app = express(); // Initialize the Express server

// Middleware
app.use(express.json()); // Accept JSON data from requests
app.use(express.urlencoded({extended: true})); // Accept URL-encoded data from requests
app.use(cors(EXPRESS_CONFIG.CORS)); // Enable CORS

app.use(session(EXPRESS_CONFIG.SESSION)); // Enable sessions

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

// Root route
// app.use(express.static('dist/web')); // Serve static files (React build

// app.get('*', (req, res) => {
//   res.sendFile('index.html', {root: 'dist/web'});
// });

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "NOT_FOUND",
    message: 'Route not found',
    details: 'The route you are trying to access does not exist',
  });
});

app.use(errorHandler()); // Error handler, allows for next(error) to be called

app.listen(EXPRESS_CONFIG.APP_PORT, () => {
  console.log(`Server is running at ${APP_URL}`);
});