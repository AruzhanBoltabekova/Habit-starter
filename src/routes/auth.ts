import {prisma} from "@/server";
import {SALT, SECRET} from "@/config";
import {TokenData} from "@/types";
import {createHandler} from "@/utils";
import {BackendError} from "@/utils/errors";
import {compareSync, hashSync} from "bcryptjs";
import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import ms from "ms";

const hashPassword = (password: string): string => {
  return hashSync(password, SALT);
}

function generateAccessToken(user: TokenData): string {
  return jwt.sign(user, SECRET, {expiresIn: '1 week'});
}

const authFormTemplate = (type: 'login' | 'register') => (`
  <form method="POST" action="/${type}">
    <label for="email">Email:</label>
    <input type="email" value="user@example.com" id="email" name="email"><br>
    <label for="password">Password:</label>
    <input type="password" value="password" id="password" name="password"><br>
    <input type="submit" value="${type}">
  </form>
`);

function saveUserAuth(req: Request, res: Response, next: NextFunction, user: {
  id: number | string,
  email: string,
  [key: string]: any
}) {
  const jwt = generateAccessToken({id: user.id, email: user.email});
  res.cookie('jwt', jwt, {maxAge: ms('1 week')});
  // Regenerate the session
  req.session.regenerate((err) => {
    if (err) next(err);
    req.session.user = user.id;
    req.session.save(function (err) {
      if (err) next(err);
      res.status(200).json({id: user.id, email: user.email, jwt: jwt})
    })
  });
}

function authRequestValidation(res: Response, req: Request, next: NextFunction) {
  // Check if request body is empty
  !req.body && next( new BackendError("BAD_REQUEST") );
  !req.body?.email && next( new BackendError("BAD_REQUEST", {message: "email is missing"}) );
  !req.body?.password && next( new BackendError("INVALID_PASSWORD") );

  let email = req.body?.email.toString().toLowerCase()
  let password = req.body?.password;

  email = email.toString().toLowerCase();

  return {email, password}
}

const getRegisterForm = createHandler((req, res, next) => {
  res.send(authFormTemplate('register'));
});

//
const getLoginForm = createHandler( (req, res, next) => {
  res.send(authFormTemplate('login'));
});

// Handle the POST request to register a user
const postRegister = createHandler(async (req, res, next) => {
  try {
    // Validate the request body
    const {email, password} = authRequestValidation(res, req, next);

    if (await prisma.user.findUnique({where: {email}})) {
      next(new BackendError("CONFLICT", {message: "User already exists"}));
    } else {
      const createUser = await prisma.user.create({data: {email, password: hashPassword(password)}});
      if (createUser) {
        saveUserAuth(req, res, next, createUser);
      } else {
        next(new BackendError("INTERNAL_ERROR", {message: "User could not be created"}));
      }
    }
  } catch (error) {
    next(error);
  }
});

// Handle the POST request to login a user
const postLogin = createHandler(async (req, res, next) => {
  try {
    // Validate the request body
    const {email, password} = authRequestValidation(res, req, next);

    const user = await prisma.user.findUnique({where: {email}});

    if (user) {
      const passMatch = compareSync(password, user.password);
      if (passMatch) {
        saveUserAuth(req, res, next, user);
      } else {
        next( new BackendError("INVALID_PASSWORD") );
      }
    } else {
      next( new BackendError("NOT_FOUND") );
    }
  } catch (error) {
    next(error);
  }
});

// Handle the POST request to logout a user
export const logout = createHandler((req, res, next) => {
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  try {
    res.clearCookie('jwt')
    res.clearCookie('connect.sid')
    req.session.user = null
    req.session.destroy((err) => {
      if (err) next(err)
      res.status(200).json({message: "Logged out"})
    })
  } catch (error) {
    next(error)
  }
});

export const login = {
  get: getLoginForm,
  post: postLogin,
}

export const register = {
  get: getRegisterForm,
  post: postRegister,
}