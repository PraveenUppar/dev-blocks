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

// middleware/validation.ts

export const validateSlugParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const slug = req.params.slug as string;

  // Slug validation rules
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slug || slug.length < 3 || slug.length > 200) {
    return res.status(400).json({
      success: false,
      error: "Invalid slug format: must be 3-200 characters",
    });
  }

  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      error:
        "Invalid slug format: only lowercase letters, numbers, and hyphens allowed",
    });
  }

  next();
};
// Add validateUpdatePost similarly...
