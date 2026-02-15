import { Router } from "express";
import { Webhook } from "svix";
import prisma from "../libs/prisma.js";
const webhookRouter = Router();
webhookRouter.post("/clerk", async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        console.error("CLERK_WEBHOOK_SECRET not set");
        return res.status(500).json({ error: "Server misconfigured" });
    }
    // Get Svix headers
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: "Missing headers" });
    }
    // Verify signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(JSON.stringify(req.body), {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    }
    catch (err) {
        console.error("Verification failed:", err);
        return res.status(400).json({ error: "Invalid signature" });
    }
    // Handle events
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
    const eventType = evt.type;
    console.log(`Webhook received: ${eventType}`);
    try {
        if (eventType === "user.created") {
            const email = email_addresses?.[0]?.email_address || `${id}@placeholder.com`;
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
            console.log(`✅ User created/updated: ${email}`);
        }
        if (eventType === "user.updated") {
            const email = email_addresses?.[0]?.email_address || `${id}@placeholder.com`;
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
            console.log(`✅ User updated: ${email}`);
        }
        if (eventType === "user.deleted") {
            await prisma.user.delete({
                where: { clerkId: id },
            });
            console.log(`✅ User deleted: ${id}`);
        }
        return res.status(200).json({ received: true });
    }
    catch (error) {
        console.error("Webhook error:", error);
        return res.status(500).json({ error: "Processing failed" });
    }
});
export default webhookRouter;
//# sourceMappingURL=clerkwebhook.js.map