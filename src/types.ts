import {schemaDotenv} from "@/config";
import {z} from "zod";

export type TokenData = { id: number | string, email: string };

type Env = z.infer<typeof schemaDotenv>;

declare module 'express-session' {
  export interface SessionData {
    user: string | number | null;
  }
}

declare global {
  namespace NodeJS {
    //@ts-ignore
    interface ProcessEnv extends Env {}
  }
}

export {};