import { Request, Response } from "express";
import * as notificationService from "../services/notification.service";

// GET / - Get notifications
export async function getNotificationsController(req: Request, res: Response) {
  const { userId } = req.query; // For testing
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await notificationService.getUserNotifications(
    userId as string,
    page,
    limit,
  );

  return res.json({ success: true, ...result });
}

// PATCH /:id/read - Mark as read
export async function markAsReadController(req: Request, res: Response) {
  const id = req.params.id as string;

  await notificationService.markAsRead(id);

  return res.json({ success: true, message: "Marked as read" });
}

// PATCH /read-all - Mark all as read
export async function markAllAsReadController(req: Request, res: Response) {
  const { userId } = req.body;

  await notificationService.markAllAsRead(userId);

  return res.json({ success: true, message: "All marked as read" });
}

// GET /unread-count
export async function getUnreadCountController(req: Request, res: Response) {
  const { userId } = req.query;
  const count = await notificationService.getUnreadCount(userId as string);
  return res.json({ success: true, data: { unreadCount: count } });
}
