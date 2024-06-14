import {_str_errors, APP_PORT, APP_URL, CORS, SECRET} from "@/config";
import {authFormTemplate, loginHandler, logoutHandler, registerHandler} from "@/routes/auth";
import {createHabitHandler, deleteHabitHandler, deleteMyUser, getGroupedHabits, getHabitIdsHandler, getHabitsHandler, getSpecificHabitHandler} from "@/routes/habit";
import {getRootApiDocsHandler} from "@/routes/root";
import {createRouter} from "@/utils/create";
import {errorHandler, handle404Error} from "@/utils/errors";
import {PrismaClient} from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {NextFunction, Request, Response} from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import ms from "ms";
import FileStore from "session-file-store";

export const prisma = new PrismaClient();

const app = express(); // Initialize the Express app

app.use(express.json()); // Accept JSON data from requests
app.use(express.urlencoded({extended: true})); // Accept URL-encoded data from requests
app.use(cors(CORS)); // Enable CORS
app.use(cookieParser()); // Allow parsing of cookies

app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: ms('1 day')},
  store: new (FileStore(session))({}),
}));

app.get('/', (req, res) => {
  res.send('Nice place to mount my react app!');
})

app.get('/register', (req, res) => {
  res.send(authFormTemplate('register'));
})

app.post('/register', registerHandler);

app.get('/login', (req, res) => {
  res.send(authFormTemplate('login'))
});

app.post('/login', loginHandler);

app.get("/logout", logoutHandler);

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    next();
  }
  else if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const j = jwt.verify(token, SECRET)
    // @ts-ignore
    req.session.user = j.userId as number;
    next();
  }
  else if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    const j = jwt.verify(token, SECRET)
    // @ts-ignore
    req.session.user = j.userId as number;
    next();
  }
  else {
    next(_str_errors["UNAUTHORIZED"]);
  }
}

async function getUserIdFromRecord(recordId: number) {
  const record = await prisma.record.findUnique({
    where: {
      id: recordId,
    },
    include: {
      Habit: {
        include: {
          User: true,
        },
      },
    },
  });

  return record?.Habit?.User?.id;
}

// get habit owner id from habitId
async function getUserIdFromHabit(habitId: number) {
  const habit = await prisma.habit.findUnique({
    where: {
      id: habitId,
    },
    include: {
      User: true,
    },
  });

  return habit?.User?.id;
}

app.use("/api/habit", isAuthenticated, createRouter((router) => {
  router.get("/deleteme", deleteMyUser);
  router.get("/", getHabitsHandler);
  router.get("/ids", getHabitIdsHandler);
  router.get("/categories", getGroupedHabits);
  router.get("/:id", getSpecificHabitHandler);
  router.post("/", createHabitHandler);
  router.delete("/:id", deleteHabitHandler);
}));

app.use("/api/record", isAuthenticated, createRouter((router) => {
  router.post("/:id", async (req, res, next) => {
    const habitId = parseInt(req.params.id);
    try {
      const getUserId = await getUserIdFromHabit(habitId);
      if (req.session.user !== getUserId) {
        next(_str_errors["UNAUTHORIZED"]);
      }
      const result = await prisma.record.create({data: {Habit: {connect: {id: habitId}}}, include: {Habit: true}});
      res.json(result);
    } catch (error) {
      next(error);
    }
  });
  router.delete("/:id", async (req, res, next) => {
    const recordId = parseInt(req.params.id);
    try {
      const getUserId = await getUserIdFromRecord(recordId);
      if (req.session.user !== getUserId) {
        next(_str_errors["UNAUTHORIZED"]);
      }
      const result = await prisma.record.delete({where: {id: recordId}});
      res.json(result);
    } catch (error) {
      next(error);
    }
  });
}));

app.use("/api", getRootApiDocsHandler);

app.use("*", handle404Error);

app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server is running at ${APP_URL}`);
});