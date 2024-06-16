import {prisma} from "@/app";
import {generateAccessToken, hashPassword} from "@/utils";
import {createHandler} from "@/utils/create";
import {compareSync} from "bcryptjs";
import {Request, Response, NextFunction} from "express";
import {_str_errors, APP_DOMAIN} from "@/config";
import ms from "ms";

export const registerHandler = createHandler(async (req, res, next) => {
  !req.body && next(_str_errors["BAD_REQUEST/EMPTY_BODY"]);
  !req.body.email && next(_str_errors["BAD_REQUEST/INVALID_BODY"]);
  !req.body.password && next(_str_errors["BAD_REQUEST/INVALID_BODY"]);

  const email = req.body.email.toString().toLowerCase();
  const password = req.body.password;

  const user = await prisma.user.findUnique({where: {email}});
  if (user) {
    next(_str_errors["REGISTER/EMAIL_EXISTS"]);
  }
  else {
    const createdUser = await prisma.user.create({data: {email, password: hashPassword(password)}});
    const jwtToken = generateAccessToken({userId: createdUser.id, email: createdUser.email});
    res.cookie('jwt', jwtToken, {domain: APP_DOMAIN, maxAge: ms('1 week')});
    req.session.regenerate((err) => {
      if (err) {next(err);}
      req.session.user = createdUser.id;
      req.session.save(function (err) {
        if (err) next(err)
        res.status(201).send({jwt: jwtToken})
      })
    });
  }
});

export const loginHandler = createHandler(async (req, res, next) => {
  !req.body && next(_str_errors["BAD_REQUEST/EMPTY_BODY"]);
  !req.body.email && next(_str_errors["BAD_REQUEST/INVALID_BODY"]);
  !req.body.password && next(_str_errors["BAD_REQUEST/INVALID_BODY"]);

  const email = req.body.email.toString().toLowerCase();
  const password = req.body.password;

  const user = await prisma.user.findUnique({where: {email}});

  if (user) {
    const passMatch = compareSync(password, user.password);
    if (passMatch) {
      const jwtToken = generateAccessToken({userId: user.id, email: user.email});
      res.cookie('jwt', jwtToken, {domain: APP_DOMAIN, maxAge: ms('1 week')});

      req.session.regenerate((err) => {
        if (err) {next(err);}
        req.session.user = user.id;
        req.session.save(function (err) {
          if (err) next(err)
          res.status(200).send({jwt: jwtToken})
        })
      });
    } else {
      next(_str_errors["UNAUTHORIZED/INVALID_PASSWORD"]);
    }
  } else {
    next(_str_errors["UNAUTHORIZED/INVALID_EMAIL"]);
  }
});

export const logoutHandler = createHandler(async (req, res, next) => {
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  res.clearCookie('jwt')
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
});

export const authFormTemplate = (type : 'login' | 'register') => (`
  <form method="POST" action="/${type}">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email"><br>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password"><br>
    <input type="submit" value="${type}}">
  </form>
`);