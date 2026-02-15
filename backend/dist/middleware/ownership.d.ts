/**
 * Verify user owns the post (for edit/delete operations)
 */
import type { NextFunction, Request, Response } from "express";
interface IdParams {
    id: string;
}
export declare function verifyPostOwnership(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=ownership.d.ts.map