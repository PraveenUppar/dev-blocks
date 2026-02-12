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
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),

  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(500, "Subtitle must be less than 500 characters")
    .trim(),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"), // ~ pages

  // coverImage: z
  //   .url("Invalid image URL")
  //   .optional()
  //   .refine(
  //     (url) => !url || /\.(jpg|jpeg|png|webp|gif)$/i.test(url),
  //     "Cover image must be a valid image URL",
  //   ),

  tags: z
    .array(
      z
        .string()
        .min(2, "Tag must be at least 2 characters")
        .max(20, "Tag must be less than 20 characters")
        .regex(/^[a-zA-Z0-9\s-]+$/, "Tag contains invalid characters"),
    )
    .max(5, "Maximum 5 tags allowed")
    .optional()
    .transform((tags) =>
      tags ? [...new Set(tags.map((t) => t.trim().toLowerCase()))] : undefined,
    ),
});

export const validateCreatePost = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = createPostSchema.parse(req.body);
    req.body = result; // Replace with validated & sanitized data
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

const updatePostSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters")
      .trim()
      .optional(),

    subtitle: z
      .string()
      .max(500, "Subtitle must be less than 500 characters")
      .trim()
      .optional(),

    content: z
      .string()
      .min(100, "Content must be at least 100 characters")
      .max(100000, "Content must be less than 100,000 characters")
      .optional(),

    coverImage: z.url("Invalid image URL").optional().nullable(), // Allow null to remove image

    tags: z
      .array(
        z
          .string()
          .min(2, "Tag must be at least 2 characters")
          .max(30, "Tag must be less than 30 characters"),
      )
      .max(5, "Maximum 5 tags allowed")
      .optional()
      .transform((tags) =>
        tags
          ? [...new Set(tags.map((t) => t.trim().toLowerCase()))]
          : undefined,
      ),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const validateUpdatePost = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = updatePostSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

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
