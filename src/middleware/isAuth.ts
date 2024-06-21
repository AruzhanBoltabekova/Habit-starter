import {ERROR, SECRET} from "@/config";
import {TokenData} from "@/types";
import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

function tokenVerify(token: string): TokenData {
  // @ts-ignore
  return jwt.verify(token, SECRET);
}

// Middleware to check if the user is authenticated
// If the user is authenticated, the request is passed to the next middleware
export default function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    next();
  } else if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const {id} = tokenVerify(token);
    req.session.user = id;
    req.session.save(function (err) {
      if (err) next(err);
      next();
    });
  } else {
    next(ERROR["AUTH_MIDDLEWARE/UNKNOWN"]);
  }
}