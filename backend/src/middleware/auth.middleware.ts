import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

// Basic Clerk middleware - adds auth to all requests
export const clerkAuthMiddleware = clerkMiddleware();
// Require authentication - returns 401 if not authenticated
export const requireAuthentication = requireAuth();
// Get the current user - adds clerkUserId to the request object if authenticated
export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = getAuth(req);

  if (auth.userId) {
    (req as any).clerkUserId = auth.userId;
  }
  next();
};
