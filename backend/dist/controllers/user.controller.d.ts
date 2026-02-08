import type { NextFunction, Request, Response } from "express";
interface usernameParams {
    username: string;
}
export declare function getUserProfileController(req: Request<usernameParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getUserPostsController(req: Request<usernameParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getUserFollowersController(req: Request<usernameParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getUserFollowingController(req: Request<usernameParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateUserProfileController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function followUserProfileController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function unfollowUserProfileController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getUserBookmarksController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getUserDraftsController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getUserReadingHistoryController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=user.controller.d.ts.map