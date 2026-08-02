import { Router } from "express";
import cloudinary from "../config/cloudinary.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/signature", verifyAdmin, (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "compsciety-blogs";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

export default router;