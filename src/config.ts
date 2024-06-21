import {toInt, url} from "@/utils";
import {$Enums, Prisma} from "@prisma/client";
import {CorsOptions} from "cors";
import {config as dotenvConfig} from "dotenv";
import session, {SessionOptions} from "express-session";
import ms from "ms";
import FileStore from "session-file-store";
import {z} from "zod";

// Define the schema for environment variables
export const schemaDotenv = z.object({
  APP_DOMAIN: z.string(),
  SECRET: z.string(),
  APP_PORT: z.string().transform(v => toInt(v)),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
});

// Load environment variables
dotenvConfig({debug: process.env.NODE_ENV === "development"});

// Required environment variables validation

const {APP_DOMAIN, SECRET, APP_PORT, APP_URL} = schemaDotenv.parse(process.env)

export const SALT = `$2a$10$${SECRET}`;

// Define the API routes
export const EXPRESS_CONFIG = {
  SESSION: {
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: ms('1 day')},
    store: new (FileStore(session))({}),
  } as SessionOptions,
  CORS: {
    origin: [
      "*",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  } as CorsOptions,
  APP_PORT : APP_PORT,
  APP_DOMAIN: APP_DOMAIN
}

// Describe the API routes
const API_ROUTES = {
  habit: {
    schema: Prisma.HabitScalarFieldEnum,
    examples: {
      post: {
        name: "Habit Name",
        schedule: [true, false, true, false, true, false, true],
        repeatings: 10,
      },
      update: {
        description: "Habit Description",
        Category: $Enums.Category.HEALTH,
        data: {
          archive: true,
        }
      }
    },
    GET: {
      all: url('/api/habit'),
      byId: url('/api/habit/:id'),
    },
    POST: {
      url: url('/api/habit'),
    },
  },
  record: {
    GET: url('/api/record'),
  }
}

// Define the routes
const ROUTES = {
  login: {
    GET: url('/login'),
    POST: {
      url: url('/login'),
      body:{
        email: "string",
        password: "string",
      },
      returns: {
        jwt: "string",
      }
    },
  },
  register: {
    GET: url('/register'),
    POST: {
      url: url('/register'),
      body:{
        email: "string",
        password: "string",
      },
      returns: {
        jwt: "string",
      }
    },
  },
  logout: {
    GET: url('/logout'),
  },
  api: {
    notes: "API Routes, requires authentication",
    GET: url('/api'),
  },
}

// Define errors
export const ERROR = {
  "NOT_FOUND": {
    status: 404,
    message: "The requested route was not found",
  },
  "BAD_REQUEST/PARAMS/EMPTY": {
    status: 400,
    message: "The request parameters were empty",
  },
  "BAD_REQUEST/BODY/EMPTY": {
    status: 400,
    message: "The request body was empty",
  },
  "BAD_REQUEST/BODY/INVALID/EMAIL": {
    status: 400,
    message: "The request body was missing an email",
  },
  "BAD_REQUEST/BODY/INVALID/PASSWORD": {
    status: 400,
    message: "The request body was missing a password",
  },
  "REGISTER/USER_EXISTS": {
    status: 409,
    message: "The user already exists",
  },
  "REGISTER/SERVER_ERROR": {
    status: 500,
    message: "An error occurred while registering the user",
  },
  "LOGIN/USER_NOT_FOUND": {
    status: 401,
    message: "The user was not found",
  },
  "LOGIN/INVALID_PASSWORD": {
    status: 401,
    message: "The password was invalid",
  },
  "AUTH_MIDDLEWARE/NO_SESSION": {
    status: 401,
    message: "The session was not found",
  },
  "AUTH_MIDDLEWARE/NO_TOKEN": {
    status: 401,
    message: "The token was not found",
  },
  "AUTH_MIDDLEWARE/UNKNOWN": {
    status: 500,
    message: "Unknown error occurred in the authentication middleware",
  },
  "HABIT/PARAMS/ID_REQUIRED": {
    status: 400,
    message: "The habit ID parameter is required",
  },
  "HABIT/UNAUTHORIZED": {
    status: 401,
    message: "Habit seems belongs to another user",
  },
  "RECORD/EXISTS": {
    status: 409,
    message: "Record with matching {date} and {habitId} already exists",
  },
  "RECORD/WRONG_USER": {
    status: 401,
    message: "Record does not belong to the user",
  }
}

// Describe the API documentation
export const DOCS = {
  ...ROUTES,
  API_ROUTES,
  CONFIG: {
    SALT,
    SECRET,
    APP_PORT,
    APP_URL,
  },
  EXPRESS_CONFIG,
  ERROR,
}

export {
  SECRET,
  APP_URL,
  APP_DOMAIN
}
