import {APP_URL, SALT, SECRET} from "@/config";
import {hashSync} from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";

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

export function generateAccessToken({userId, email}: {userId: number | string, email: string}): string {
  return jwt.sign({userId, email}, SECRET, {expiresIn: ms('1 week')});
}

export const hashPassword = (password: string): string => {
  return hashSync(password, SALT);
}
