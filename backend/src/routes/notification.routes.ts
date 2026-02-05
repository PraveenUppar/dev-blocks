import { Router } from "express";
import {
  requireAuthentication,
  getCurrentUser,
} from "../middleware/auth.middleware";
import {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
  getUnreadCountController,
} from "../controllers/notification.controller";

const notificationRouter = Router();

// Get user's notifications
notificationRouter.get(
  "/",
  requireAuthentication,
  getCurrentUser,
  getNotificationsController,
);

// Mark single notification as read
notificationRouter.patch(
  "/:id/read",
  requireAuthentication,
  getCurrentUser,
  markAsReadController,
);

// Mark all notifications as read
notificationRouter.patch(
  "/read-all",
  requireAuthentication,
  getCurrentUser,
  markAllAsReadController,
);

// Get unread count
notificationRouter.get(
  "/unread-count",
  requireAuthentication,
  getCurrentUser,
  getUnreadCountController,
);

export default notificationRouter;
