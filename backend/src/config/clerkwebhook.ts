import { Router, type Request, type Response } from "express";
import { Webhook } from "svix";
import prisma from "../libs/prisma.js";
import logger from "./logger.js";

const webhookRouter = Router();

webhookRouter.post("/clerk", async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    logger.error("CLERK_WEBHOOK_SECRET not set");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  // Get Svix headers
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing headers" });
  }

  // Verify signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    const payload = req.body.toString();
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    logger.error("Webhook verification failed", { error: err });
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Handle events
  const { id, email_addresses, username, first_name, last_name, image_url } =
    evt.data;
  const eventType = evt.type;

  logger.info(`Webhook received: ${eventType}`);

  try {
    if (eventType === "user.created") {
      const email =
        email_addresses?.[0]?.email_address || `${id}@placeholder.com`;
      const name = [first_name, last_name].filter(Boolean).join(" ") || null;
      const finalUsername = username || `user_${id.slice(-8)}`;
      // Use upsert to handle if user already exists
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          username: finalUsername,
          name,
          avatar: image_url,
        },
        create: {
          clerkId: id,
          email,
          username: finalUsername,
          name,
          avatar: image_url,
        },
      });
      logger.info(`User created/updated: ${email}`);
    }

    if (eventType === "user.updated") {
      const email =
        email_addresses?.[0]?.email_address || `${id}@placeholder.com`;
      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email,
          username,
          name,
          avatar: image_url,
        },
      });
      logger.info(`User updated: ${email}`);
    }

    if (eventType === "user.deleted") {
      await prisma.user.delete({
        where: { clerkId: id },
      });
      logger.info(`User deleted: ${id}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error("Webhook processing error", { error });
    return res.status(500).json({ error: "Processing failed" });
  }
});

export default webhookRouter;
