import { Router } from "express";
import Blog from "../models/Blog.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

function isValidHttpUrl(string) {
  if (!string || typeof string !== "string") return true;
  const trimmed = string.trim();
  if (!trimmed) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidImageUrl(string) {
  if (!string || typeof string !== "string") return true;
  const trimmed = string.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("/") || trimmed.startsWith("data:image/")) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

router.get("/", async (req, res) => {
  const { page, limit } = req.query;

  if (page !== undefined || limit !== undefined) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, Math.min(parseInt(limit, 10) || 10, 100));
    const total = await Blog.countDocuments();
    const items = await Blog.find()
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l);

    return res.json({
      items,
      total,
      page: p,
      limit: l,
      totalPages: Math.max(1, Math.ceil(total / l)),
    });
  }

  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: "Invalid blog id" });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  const image = typeof req.body.image === "string" ? req.body.image.trim() : "";
  const fbLink = typeof req.body.fbLink === "string" ? req.body.fbLink.trim() : "";

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  if (title.length > 200) {
    return res.status(400).json({ message: "Title must not exceed 200 characters" });
  }

  if (image && !isValidImageUrl(image)) {
    return res.status(400).json({ message: "Invalid image URL format" });
  }

  if (fbLink && !isValidHttpUrl(fbLink)) {
    return res.status(400).json({ message: "Invalid fbLink URL format (must start with http:// or https://)" });
  }

  const blog = await Blog.create({ title, content, image, fbLink });
  res.status(201).json(blog);
});

router.put("/:id", verifyAdmin, async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  const image = typeof req.body.image === "string" ? req.body.image.trim() : "";
  const fbLink = typeof req.body.fbLink === "string" ? req.body.fbLink.trim() : "";

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  if (title.length > 200) {
    return res.status(400).json({ message: "Title must not exceed 200 characters" });
  }

  if (image && !isValidImageUrl(image)) {
    return res.status(400).json({ message: "Invalid image URL format" });
  }

  if (fbLink && !isValidHttpUrl(fbLink)) {
    return res.status(400).json({ message: "Invalid fbLink URL format (must start with http:// or https://)" });
  }

  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image, fbLink },
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: "Invalid blog id" });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid blog id" });
  }
});

export default router;