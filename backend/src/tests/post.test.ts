import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock prisma
vi.mock("../libs/prisma.js", () => ({
  default: {
    $queryRaw: vi.fn(),
  },
}));

// Mock Clerk — clerkMiddleware must always attach req.auth()
vi.mock("@clerk/express", () => ({
  clerkMiddleware:
    () =>
    (req: any, _res: any, next: any) => {
      req.auth = () => ({ userId: "clerk_test_user_123" });
      next();
    },
  requireAuth:
    () =>
    (req: any, _res: any, next: any) => {
      req.auth = () => ({ userId: "clerk_test_user_123" });
      next();
    },
}));

// Mock sanitizeHtml
vi.mock("../utils/contentSanitization.js", () => ({
  sanitizeHtml: vi.fn((html: string) => html),
}));

// Mock post services (post controller imports getUserClerkIdService from here)
vi.mock("../services/post.service.js", () => ({
  getUserClerkIdService: vi.fn(),
  getUserIdService: vi.fn(),
  getUserNameService: vi.fn(),
  getPublishedPostService: vi.fn(),
  getPublishedPostByIdService: vi.fn(),
  getPublishedPostBySlugService: vi.fn(),
  createPostService: vi.fn(),
  getDraftPostByIdService: vi.fn(),
  updatePostService: vi.fn(),
  deletePostService: vi.fn(),
  publishPostService: vi.fn(),
  toggleLikePostService: vi.fn(),
  getLikeCountService: vi.fn(),
  toggleBookmarkPostService: vi.fn(),
}));

// Mock user services
vi.mock("../services/user.service.js", () => ({
  getUserClerkIdService: vi.fn(),
  getUserIdService: vi.fn(),
  getUserNameService: vi.fn(),
  getUserProfileService: vi.fn(),
  getUserPostsService: vi.fn(),
  getUserFollowerService: vi.fn(),
  getUserFollowingService: vi.fn(),
  updateUserProfileService: vi.fn(),
  followUserProfileService: vi.fn(),
  unfollowUserProfileService: vi.fn(),
  getUserBookmarksService: vi.fn(),
  getUserDraftsService: vi.fn(),
  getUserReadingHistoryService: vi.fn(),
}));

import app from "../app.js";
import {
  getPublishedPostService,
  getPublishedPostByIdService,
  getPublishedPostBySlugService,
  createPostService,
  deletePostService,
  getDraftPostByIdService,
  publishPostService,
  toggleLikePostService,
  toggleBookmarkPostService,
  getUserClerkIdService,
} from "../services/post.service.js";

const mockUser = {
  id: "user-uuid-123",
  clerkId: "clerk_test_user_123",
  username: "testuser",
  email: "test@test.com",
};

describe("Post Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Post controller imports getUserClerkIdService from post.service.js
    vi.mocked(getUserClerkIdService).mockResolvedValue(mockUser as any);
  });

  // ==================== PUBLIC ROUTES ====================

  describe("GET /api/post", () => {
    it("should return paginated published posts", async () => {
      const mockPosts = {
        data: [{ id: "1", title: "Test Post" }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      vi.mocked(getPublishedPostService).mockResolvedValue(mockPosts as any);

      const res = await request(app).get("/api/post");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it("should accept pagination query params", async () => {
      vi.mocked(getPublishedPostService).mockResolvedValue({
        data: [],
        pagination: { page: 2, limit: 5, total: 0, totalPages: 0 },
      } as any);

      const res = await request(app).get("/api/post?page=2&limit=5");

      expect(res.status).toBe(200);
      expect(getPublishedPostService).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
      });
    });
  });

  describe("GET /api/post/id/:id", () => {
    it("should return a post by valid UUID", async () => {
      const mockPost = { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", title: "Test" };
      vi.mocked(getPublishedPostByIdService).mockResolvedValue(mockPost as any);

      const res = await request(app).get(
        "/api/post/id/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject invalid UUID", async () => {
      const res = await request(app).get("/api/post/id/not-a-uuid");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/post/slug/:slug", () => {
    it("should return a post by valid slug", async () => {
      const mockPost = { id: "1", slug: "test-post" };
      vi.mocked(getPublishedPostBySlugService).mockResolvedValue(mockPost as any);

      const res = await request(app).get("/api/post/slug/test-post");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject invalid slug format", async () => {
      const res = await request(app).get("/api/post/slug/AB");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ==================== PROTECTED ROUTES ====================

  describe("POST /api/post/create", () => {
    it("should create a draft post with valid data", async () => {
      const mockPost = { id: "1", title: "Test Post", status: "DRAFT" };
      vi.mocked(createPostService).mockResolvedValue(mockPost as any);

      const res = await request(app).post("/api/post/create").send({
        title: "Test Post",
        subtitle: "Test subtitle here",
        content: "This is valid test content that is at least 10 characters",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should reject post with missing title", async () => {
      const res = await request(app).post("/api/post/create").send({
        subtitle: "Test subtitle",
        content: "This is valid content",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe("Validation failed");
    });

    it("should reject post with too many tags", async () => {
      const res = await request(app).post("/api/post/create").send({
        title: "Test Post",
        subtitle: "Test subtitle here",
        content: "This is valid test content",
        tags: ["one", "two", "three", "four", "five", "six"],
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("DELETE /api/post/delete/:id", () => {
    it("should delete a post by valid UUID", async () => {
      vi.mocked(getDraftPostByIdService).mockResolvedValue({ id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" } as any);
      vi.mocked(deletePostService).mockResolvedValue({} as any);

      const res = await request(app).delete(
        "/api/post/delete/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("PATCH /api/post/publish/:id", () => {
    it("should publish a post", async () => {
      vi.mocked(publishPostService).mockResolvedValue({} as any);

      const res = await request(app).patch(
        "/api/post/publish/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/post/like/:id", () => {
    it("should toggle like on a post", async () => {
      vi.mocked(toggleLikePostService).mockResolvedValue({
        liked: true,
        likeCount: 5,
      } as any);

      const res = await request(app).post(
        "/api/post/like/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/post/bookmark/:id", () => {
    it("should toggle bookmark on a post", async () => {
      vi.mocked(toggleBookmarkPostService).mockResolvedValue({
        bookmarked: true,
      } as any);

      const res = await request(app).post(
        "/api/post/bookmark/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ==================== 404 ====================

  describe("Unknown routes", () => {
    it("should return 404 for non-existent routes", async () => {
      const res = await request(app).get("/api/nonexistent");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
