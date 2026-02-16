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

// Mock all user services
vi.mock("../services/user.service.js", () => ({
  getUserProfileService: vi.fn(),
  getUserNameService: vi.fn(),
  getUserClerkIdService: vi.fn(),
  getUserIdService: vi.fn(),
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

// Mock post services (may be imported transitively)
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

import app from "../app.js";
import {
  getUserProfileService,
  getUserNameService,
  getUserClerkIdService,
  getUserIdService,
  getUserPostsService,
  getUserFollowerService,
  getUserFollowingService,
  updateUserProfileService,
  followUserProfileService,
  unfollowUserProfileService,
  getUserBookmarksService,
  getUserDraftsService,
} from "../services/user.service.js";

const mockUser = {
  id: "user-uuid-123",
  clerkId: "clerk_test_user_123",
  username: "testuser",
  email: "test@test.com",
  name: "Test User",
  bio: "A test user",
  avatar: null,
};

describe("User Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUserClerkIdService).mockResolvedValue(mockUser as any);
  });

  // ==================== PUBLIC ROUTES ====================

  describe("GET /api/user/:username", () => {
    it("should return a user profile", async () => {
      vi.mocked(getUserProfileService).mockResolvedValue(mockUser as any);

      const res = await request(app).get("/api/user/testuser");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe("testuser");
    });

    it("should return 404 for non-existent user", async () => {
      vi.mocked(getUserProfileService).mockResolvedValue(null);

      const res = await request(app).get("/api/user/nobody");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should reject invalid username format", async () => {
      const res = await request(app).get("/api/user/ab");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/user/:username/posts", () => {
    it("should return paginated user posts", async () => {
      vi.mocked(getUserNameService).mockResolvedValue(mockUser as any);
      vi.mocked(getUserPostsService).mockResolvedValue({
        data: [{ id: "1", title: "Post 1" }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      } as any);

      const res = await request(app).get("/api/user/testuser/posts");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it("should return 404 for non-existent user's posts", async () => {
      vi.mocked(getUserNameService).mockResolvedValue(null);

      const res = await request(app).get("/api/user/nobody/posts");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/user/:username/followers", () => {
    it("should return paginated followers list", async () => {
      vi.mocked(getUserNameService).mockResolvedValue(mockUser as any);
      vi.mocked(getUserFollowerService).mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      const res = await request(app).get("/api/user/testuser/followers");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/user/:username/following", () => {
    it("should return paginated following list", async () => {
      vi.mocked(getUserNameService).mockResolvedValue(mockUser as any);
      vi.mocked(getUserFollowingService).mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      const res = await request(app).get("/api/user/testuser/following");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ==================== PROTECTED ROUTES ====================

  describe("GET /api/user/profile", () => {
    it("should return current user profile", async () => {
      const res = await request(app).get("/api/user/profile");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe("testuser");
    });
  });

  describe("PUT /api/user/update", () => {
    it("should update user profile with valid data", async () => {
      vi.mocked(updateUserProfileService).mockResolvedValue({
        ...mockUser,
        name: "Updated Name",
      } as any);

      const res = await request(app)
        .put("/api/user/update")
        .send({ name: "Updated Name" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject update with empty body", async () => {
      const res = await request(app).put("/api/user/update").send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject name that is too long", async () => {
      const res = await request(app)
        .put("/api/user/update")
        .send({ name: "A".repeat(51) });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/user/bookmarks", () => {
    it("should return user bookmarks", async () => {
      vi.mocked(getUserBookmarksService).mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      const res = await request(app).get("/api/user/bookmarks");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/user/drafts", () => {
    it("should return user drafts", async () => {
      vi.mocked(getUserDraftsService).mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      const res = await request(app).get("/api/user/drafts");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/user/:id/follow", () => {
    it("should follow a user with valid UUID", async () => {
      vi.mocked(getUserIdService).mockResolvedValue({
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      } as any);
      vi.mocked(followUserProfileService).mockResolvedValue({} as any);

      const res = await request(app).post(
        "/api/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890/follow",
      );

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should reject following yourself", async () => {
      const res = await request(app).post(
        "/api/user/user-uuid-123/follow",
      );

      // user-uuid-123 is the mock user's id — should get badRequest
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject invalid UUID for follow", async () => {
      const res = await request(app).post("/api/user/not-a-uuid/follow");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("DELETE /api/user/:id/unfollow", () => {
    it("should unfollow a user with valid UUID", async () => {
      vi.mocked(unfollowUserProfileService).mockResolvedValue({} as any);

      const res = await request(app).delete(
        "/api/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890/unfollow",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
