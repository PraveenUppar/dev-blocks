-- DropIndex
DROP INDEX "Post_status_createdAt_idx";

-- CreateIndex
CREATE INDEX "Post_status_publishedAt_idx" ON "Post"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Post_status_deletedAt_idx" ON "Post"("status", "deletedAt");
