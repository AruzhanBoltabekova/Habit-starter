import {toInt} from "@/utils";
import {config as dotenvConfig} from "dotenv";
import {z} from "zod";
import jsonConfig from "@/json/config.json";
import _str from  "@/json/str.json";

export const { CORS } = jsonConfig;
export const { errors: _str_errors } = _str;
export { _str, jsonConfig }

// Enable debug mode and load environment variables
export const IS_DEBUG: boolean = true;

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
export let {
  SECRET,
  APP_DOMAIN,
  APP_URL,
  APP_PORT,
  DATABASE_URL,
} = schemaDotenv.parse(process.env);

export const SALT = `$2a$10$${SECRET}`;

if (!DATABASE_URL || !SECRET || !SALT || !APP_DOMAIN || !APP_URL || !APP_PORT) {
  throw new Error( _str_errors["ERROR/DOTENV"].message );
}