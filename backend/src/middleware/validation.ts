import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

// UUID validation
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuidSchema = z.uuid();
  const result = uuidSchema.safeParse(req.params.id);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid ID format",
      details: result.error.issues,
    });
  }
  next();
};

// Post creation validation
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.url().optional(),
  tags: z.array(z.string()).max(5).optional(),
});

export const validateCreatePost = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createPostSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.issues,
    });
  }

  req.body = result.data; // Type-safe parsed data
  next();
};

// Add validateUpdatePost similarly...
