import { Router } from "express";
import {
  listTagsController,
  getPostsByTagController,
} from "../controllers/tag.controller";

const tagRouter = Router();

// List all tags with post counts
tagRouter.get("/", listTagsController);
// Get all posts for a specific tag
tagRouter.get("/:slug/posts", getPostsByTagController);

export default tagRouter;
