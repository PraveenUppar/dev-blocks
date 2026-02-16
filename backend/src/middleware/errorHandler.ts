import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../errors/httpStatus.js";
import logger from "../config/logger.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // ---- AppError (custom errors) ----
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  // ---- Zod Validation Errors ----
  if (err instanceof z.ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        message: "Validation failed",
        statusCode: HTTP_STATUS.BAD_REQUEST,
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
  }

  // ---- Prisma Known Errors ----
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: {
          message: "Resource already exists",
          statusCode: HTTP_STATUS.CONFLICT,
          field: err.meta?.target,
        },
      });
    }
    if (err.code === "P2025") {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          message: "Resource not found",
          statusCode: HTTP_STATUS.NOT_FOUND,
        },
      });
    }
  }

  // ---- Clerk Auth Errors ----
  if (
    err instanceof Error &&
    "status" in err &&
    (err as any).status === 401
  ) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        message: "Unauthorized",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      },
    });
  }

  // ---- Unknown / Internal Errors ----
  logger.error("Unhandled Error:", {
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err instanceof Error
            ? err.message
            : "Internal server error",
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
  });
};
