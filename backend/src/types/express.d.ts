import { User } from "../generated/prisma";

export type SafeUser = Omit<User, "passwordHash">;

declare global {
  namespace Express {
    interface Request {
      clerkUserId?: string;
      user?: SafeUser;
      auth: import("@clerk/types").Auth;
    }
  }
}

export {};
