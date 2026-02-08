import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
export const authMiddleware = clerkMiddleware();
export const requireAuthentication = requireAuth();
export { getAuth };
//# sourceMappingURL=auth.middleware.js.map