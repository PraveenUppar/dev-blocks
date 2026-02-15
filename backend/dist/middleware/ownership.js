import prisma from "../libs/prisma.js";
export async function verifyPostOwnership(req, res, next) {
    try {
        const clerkId = req.auth().userId;
        const postId = req.params.id;
        if (!clerkId) {
            return res.status(401).json({
                success: false,
                error: "Authentication required",
            });
        }
        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
            });
        }
        // Check ownership
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }
        if (post.authorId !== user.id) {
            return res.status(403).json({
                success: false,
                error: "You do not have permission to access this resource",
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=ownership.js.map