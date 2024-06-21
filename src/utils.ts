import {prisma} from "@/server";
import {APP_URL, ERROR} from "@/config";
import {type NextFunction, type Request, type Response, Router} from 'express';
import type {z} from 'zod';

// List only the ids of the items
export function listItemIds(items: Array<any>): Array<number | string> {
  return items.map((item) => item.id);
}

// Convert a string to an integer
export function toInt(str: string): number {
  return parseInt(str, 10);
}

// Create a URL from a path
export function url(path: string): string {
  return new URL(path, APP_URL).toString();
}

export function createRouter(callback: (router: Router) => void) {
  const router = Router();
  callback(router);
  return router;
}

export function createHandler<T extends z.ZodType>(
  schema: T,
  handler: (
    req: Omit<Request, keyof z.output<T>> & z.output<T>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>
): (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function createHandler(
  handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
): (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function createHandler<T extends z.ZodType>(
  schemaOrHandler:
    | T
    | ((req: Request, res: Response, next: NextFunction) => void | Promise<void>),
  handler?: (
    req: Omit<Request, keyof z.output<T>> & z.output<T>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (handler) {
        const schema = schemaOrHandler as T;
        schema.parse(req);
        await handler(req, res, next);
      }
      else {
        const handler = schemaOrHandler as (
          req: Request,
          res: Response,
          next: NextFunction
        ) => void | Promise<void>;
        await handler(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  };
}

export function sessionUserID(req: Request, res: Response, next: NextFunction) : number {
  !req.session && next(ERROR["AUTH_MIDDLEWARE/NO_SESSION"]);
  !req.session.user && next(ERROR["AUTH_MIDDLEWARE/NO_TOKEN"]);
  return toInt(req.session.user as string);
}

export function idParam(req: Request, res: Response, next: NextFunction) : number {
  // Check if request body is empty
  !req.params && next(ERROR["BAD_REQUEST/PARAMS/EMPTY"]);
  !req.params.id && next(ERROR["HABIT/PARAMS/ID_REQUIRED"]);
  return toInt(req.params.id);
}

export async function isAuthorByRecordID(recordId: number, userId: number) {
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
  return record?.Habit?.User?.id === userId;
}

export async function isAuthorByHabitID(habitId: number, userId: number) {
  const habit = await prisma.habit.findUnique({
    where: {
      id: habitId,
    },
    include: {
      User: true,
    },
  });
  return habit?.User?.id === userId;
}