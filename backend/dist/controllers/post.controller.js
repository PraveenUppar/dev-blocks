import { getPublishedPostService, getPublishedPostByIdService, getPublishedPostBySlugService, getUserClerkIdService, createPostService, updatePostService, deletePostService, publishPostService, toggleLikePostService, toggleBookmarkPostService, getDraftPostByIdService, getLikeCountService,
//   readingPublishedPostService, -- later
 } from "../services/post.service.js";
import { sanitizeHtml } from "../utils/contentSanitization.js";
// ==================== PUBLIC CONTROLLERS ====================
// GET Published Posts for Homepage Controller
export async function getPublishedPostController(req, res, next) {
    try {
        // User sends: ?limit=999999999
        // Your DB tries to fetch 999 million records → Server crashes
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        // // Optional: Add sorting and filtering
        // const sortBy = (req.query.sortBy as string) || "latest";
        // const tag = req.query.tag as string;
        const posts = await getPublishedPostService({ page, limit });
        return res.status(200).json({ success: true, ...posts });
    }
    catch (error) {
        next(error);
    }
}
// GET Published Post Metadata by ID Controller
// If user is signed in - return his likes on post and bookmark of post he did - so auth needed
export async function getPublishedPostByIdController(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.auth().userId;
        const post = await getPublishedPostByIdService(id, userId);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: { message: "Post not found" },
            });
        }
        return res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
}
// GET Published Post by Slug Controller
export async function getPublishedPostBySlugController(req, res, next) {
    try {
        const slug = req.params.slug;
        const userId = req.auth().userId;
        const post = await getPublishedPostBySlugService(slug, userId);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: { message: "Post not found" },
            });
        }
        return res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
}
// ==================== PROTECTED CONTROLLERS ====================
// CREATE a new Draft Post Controller
export async function createPostController(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const user = await getUserClerkIdService(clerkId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: "User not found" },
            });
        }
        const { title, subtitle, content, coverImage, tags } = req.body;
        // For tags "React", "react ", and "React" are all treated as the same tag, preventing duplicate database entries - done during validation
        const sanitizedContent = sanitizeHtml(content);
        const post = await createPostService({
            authorId: user.id,
            title,
            content: sanitizedContent,
            subtitle,
            tags,
            coverImage,
        });
        return res.status(201).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
}
// GET Draft Post by ID Controller
export async function getDraftPostByIdController(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const user = await getUserClerkIdService(clerkId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
            });
        }
        const { id } = req.params;
        const post = await getDraftPostByIdService(id, user.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: { message: "Post not found" },
            });
        }
        return res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
}
// UPDATE a Draft Post by ID Controller
export async function updatePostController(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const user = await getUserClerkIdService(clerkId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: "User not found" },
            });
        }
        const { id } = req.params;
        const findpost = await getDraftPostByIdService(id, user.id);
        if (!findpost) {
            return res.status(404).json({
                success: false,
                error: { message: "Post not found" },
            });
        }
        const { title, subtitle, content, tags, coverImage } = req.body;
        const sanitizedContent = sanitizeHtml(content);
        const post = await updatePostService({
            userId: user.id,
            postId: id,
            title,
            tags,
            content: sanitizedContent,
            subtitle,
            coverImage,
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }
        return res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
}
// DELETE a Post by ID Controller
export async function deletePostController(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const user = await getUserClerkIdService(clerkId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: "User not found" },
            });
        }
        const { id: postId } = req.params;
        const findpost = await getDraftPostByIdService(postId, user.id);
        if (!findpost) {
            return res.status(404).json({
                success: false,
                error: { message: "Post not found" },
            });
        }
        await deletePostService(postId, user.id);
        return res.json({ success: true, message: "Post deleted" });
    }
    catch (error) {
        next(error);
    }
}
// PUBLISH a Post by ID Controller
export async function publishPostController(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const user = await getUserClerkIdService(clerkId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: "User not found" },
            });
        }
        const { id: postId } = req.params;
        // const findpost = await getDraftPostByIdService(postId, user.id);
        // if (!findpost) {
        //   return res.status(404).json({
        //     success: false,
        //     error: { message: "Post not found" },
        //   });
        // }
        const post = await publishPostService(postId, user.id);
        return res.json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
}
// LIKE and UNLIKE a Post by ID Controller
export async function likePublishedPostController(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const user = await getUserClerkIdService(clerkId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: "User not found" },
            });
        }
        const { id: postId } = req.params;
        const existing = await getPublishedPostByIdService(postId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: { message: "Post not found" },
            });
        }
        const result = await toggleLikePostService(user.id, postId);
        const likeCount = await getLikeCountService(postId);
        return res.json({
            success: true,
            data: {
                liked: result.liked,
                likeCount,
                message: result.liked ? "Post liked" : "Like removed",
            },
        });
    }
    catch (error) {
        next(error);
    }
}
// BOOKMARK and UNBOOKMARK a Post by ID Controller
export async function bookmarkPublishedPostController(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const user = await getUserClerkIdService(clerkId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: "User not found" },
            });
        }
        const { id: postId } = req.params;
        const existing = await getPublishedPostByIdService(postId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: { message: "Post not found" },
            });
        }
        const result = await toggleBookmarkPostService(user.id, postId);
        return res.json({
            success: true,
            data: {
                bookmarked: result.bookmarked,
                message: result.bookmarked ? "Post bookmarked" : "Bookmarked removed",
            },
        });
    }
    catch (error) {
        next(error);
    }
}
// RECORD a Reading History -- later
// export async function readingPublishedPostController(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//   } catch (error) {
//     next(error);
//   }
// }
//# sourceMappingURL=post.controller.js.map