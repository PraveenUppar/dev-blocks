import type { NextFunction, Request, Response } from "express";
export declare function getPublishedPostController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
interface IdParams {
    id: string;
}
export declare function getPublishedPostByIdController(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getPublishedPostBySlugController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createPostController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getDraftPostByIdController(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updatePostController(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deletePostController(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function publishPostController(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function likePublishedPostController(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function bookmarkPublishedPostController(req: Request<IdParams>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=post.controller.d.ts.map