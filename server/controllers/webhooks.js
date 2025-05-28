import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Received webhook");

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Use rawBody for verification (assuming express.json({ verify: ... }) middleware is set)
    const evt = await whook.verify(req.rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("Webhook verified:", evt.type);

    const { data, type } = evt;
    console.log("Webhook data:", data);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          resume: "",
        };

        try {
          const createdUser = await User.create(userData);
          console.log("User created in DB:", createdUser);
        } catch (err) {
          console.error("Error creating user in DB:", err);
        }
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          resume: "",
        };

        try {
          const updatedUser = await User.findByIdAndUpdate(data.id, userData, {
            new: true,
            runValidators: true,
          });
          if (updatedUser) {
            console.log("User updated in DB:", updatedUser);
          } else {
            console.log("User to update not found with id:", data.id);
          }
        } catch (err) {
          console.error("Error updating user in DB:", err);
        }
        break;
      }
      case "user.deleted": {
        try {
          const deletedUser = await User.findByIdAndDelete(data.id);
          if (deletedUser) {
            console.log("User deleted from DB:", deletedUser);
          } else {
            console.log("User to delete not found with id:", data.id);
          }
        } catch (err) {
          console.error("Error deleting user from DB:", err);
        }
        break;
      }
      default:
        console.log("Unhandled event type:", type);
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};
