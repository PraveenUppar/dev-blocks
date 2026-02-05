import { Request, Response } from "express";
import * as tagService from "../services/tag.service";

// GET / - List all tags
export async function listTagsController(req: Request, res: Response) {
  const tags = await tagService.listTags();
  return res.json({ success: true, data: tags });
}

// GET /:slug/posts - Get posts by tag
export async function getPostsByTagController(req: Request, res: Response) {
  const slug = req.params.slug as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await tagService.getPostsByTag(slug, page, limit);

  if (!result) {
    return res.status(404).json({
      success: false,
      error: { message: "Tag not found" },
    });
  }

  return res.json({ success: true, ...result });
}
