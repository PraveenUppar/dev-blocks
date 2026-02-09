import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Resource already exists",
        field: err.meta?.target,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Resource not found" });
    }
  }

  // Clerk errors
  if (err.status === 401) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Default
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};
