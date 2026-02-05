import { User } from "../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      clerkUserId?: string;
      dbUser?: User;
    }
  }
}

export {};
