import {schemaDotenv} from "@/config";
import {z} from "zod";

type Env = z.infer<typeof schemaDotenv>;

declare module 'express-session' {
  export interface SessionData {
    user: string | number | null;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};