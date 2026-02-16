import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock prisma before importing app
vi.mock("../libs/prisma.js", () => ({
  default: {
    $queryRaw: vi.fn(),
  },
}));

// Mock Clerk middleware
vi.mock("@clerk/express", () => ({
  clerkMiddleware: () => (_req: any, _res: any, next: any) => next(),
  requireAuth: () => (_req: any, _res: any, next: any) => next(),
}));

import app from "../app.js";
import prisma from "../libs/prisma.js";

describe("Health Check Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /health", () => {
    it("should return status ok with uptime and timestamp", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body).toHaveProperty("uptime");
      expect(res.body).toHaveProperty("timestamp");
      expect(typeof res.body.uptime).toBe("number");
    });
  });

  describe("GET /health/ready", () => {
    it("should return ok when database is connected", async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ "?column?": 1 }]);

      const res = await request(app).get("/health/ready");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.database.status).toBe("connected");
      expect(res.body.database).toHaveProperty("latency");
      expect(res.body).toHaveProperty("memory");
    });

    it("should return 503 when database is disconnected", async () => {
      vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("DB down"));

      const res = await request(app).get("/health/ready");

      expect(res.status).toBe(503);
      expect(res.body.status).toBe("degraded");
      expect(res.body.database.status).toBe("disconnected");
    });
  });
});
