import { requireAuth, getAuth } from "@clerk/express";
export const requireAuthentication = requireAuth();
export { getAuth };
