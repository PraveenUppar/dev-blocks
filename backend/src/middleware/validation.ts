import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";

// ============ Reusable Validate Factory ============

// Generic middleware factory — pass a schema + source (body, query, params)
export function validate(
  schema: z.ZodTypeAny,
  source: "body" | "query" | "params" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      throw result.error; // ZodError → caught by global error handler
    }
    // Express 5: req.query is a prototype getter, so use defineProperty
    // to shadow it on the instance with the validated/transformed data.
    if (source === "query") {
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
      });
    } else {
      req[source] = result.data;
    }
    next();
  };
}

// ============ Shared Schemas ============

// Pagination query params — reused across all list endpoints
const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val || "1");
      return Math.max(1, isNaN(num) ? 1 : num);
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val || "10");
      return Math.min(50, Math.max(1, isNaN(num) ? 10 : num));
    }),
  search: z.string().optional().default(""),
  sortBy: z.enum(["latest", "oldest", "popular"]).optional().default("latest"),
});

export const validatePaginationQuery = validate(paginationSchema, "query");

// UUID param validation
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

// Username param validation
const usernameParamSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
});

export const validateUsernameParam = validate(usernameParamSchema, "params");

// Slug param validation
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

// ============ Post Schemas ============

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim(),

  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(200, "Subtitle must be less than 200 characters")
    .trim(),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(20000, "Content must be less than 20,000 characters"),

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

export const validateCreatePost = validate(createPostSchema);

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
          .max(20, "Tag must be less than 20 characters"),
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

export const validateUpdatePost = validate(updatePostSchema);

// ============ User Schemas ============

const updateUserProfileSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(50, "Name must be less than 50 characters")
      .trim()
      .optional(),

    bio: z
      .string()
      .max(300, "Bio must be less than 300 characters")
      .trim()
      .optional(),

    avatar: z.url("Invalid avatar URL").optional().nullable(),

    website: z.url("Invalid website URL").optional().nullable(),

    twitter: z
      .string()
      .max(100, "Twitter handle must be less than 100 characters")
      .trim()
      .optional()
      .nullable(),

    github: z
      .string()
      .max(100, "GitHub username must be less than 100 characters")
      .trim()
      .optional()
      .nullable(),

    linkedin: z
      .string()
      .max(100, "LinkedIn URL must be less than 100 characters")
      .trim()
      .optional()
      .nullable(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const validateUpdateUserProfile = validate(updateUserProfileSchema);
