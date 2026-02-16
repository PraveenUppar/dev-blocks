import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";

// UUID validation
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuidSchema = z.uuid();
  const result = uuidSchema.safeParse(req.params.id);
  if (!result.success) {
    throw AppError.badRequest("Invalid ID format");
  }
  next();
};

// Post creation validation
const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 200 characters")
    .trim(),

  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(200, "Subtitle must be less than 500 characters")
    .trim(),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(10000, "Content must be less than 1000 characters"),

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
  const result = createPostSchema.safeParse(req.body);
  if (!result.success) {
    throw result.error; 
  }
  req.body = result.data;
  next();
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
      .max(200, "Subtitle must be less than 200 characters")
      .trim()
      .optional(),

    content: z
      .string()
      .min(100, "Content must be at least 100 characters")
      .max(10000, "Content must be less than 10,000 characters")
      .optional(),

    coverImage: z.url("Invalid image URL").optional().nullable(),

    tags: z
      .array(
        z
          .string()
          .min(2, "Tag must be at least 2 characters")
          .max(20, "Tag must be less than 30 characters"),
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
  const result = updatePostSchema.safeParse(req.body);
  if (!result.success) {
    throw result.error; 
  }
  req.body = result.data;
  next();
};

export const validateSlugParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const slug = req.params.slug as string;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slug || slug.length < 3 || slug.length > 200) {
    throw AppError.badRequest(
      "Invalid slug format: must be 3-200 characters",
    );
  }

  if (!slugRegex.test(slug)) {
    throw AppError.badRequest(
      "Invalid slug format: only lowercase letters, numbers, and hyphens allowed",
    );
  }

  next();
};
