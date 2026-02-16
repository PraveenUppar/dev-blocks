import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../libs/prisma.js";

const healthRouter = Router();

// Liveness — is the server process alive?
healthRouter.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Readiness — can we handle requests? (checks DB connectivity)
healthRouter.get("/ready", async (req: Request, res: Response) => {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - start;

    res.json({
      status: "ok",
      database: { status: "connected", latency: `${dbLatency}ms` },
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
    });
  } catch {
    res.status(503).json({
      status: "degraded",
      database: { status: "disconnected" },
    });
  }
});

export default healthRouter;
