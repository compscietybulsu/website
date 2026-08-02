import { Router } from "express";
import Blog from "../models/Blog.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
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
  const { title, content, image, fbLink } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  const blog = await Blog.create({ title, content, image, fbLink });
  res.status(201).json(blog);
});

router.put("/:id", verifyAdmin, async (req, res) => {
  const { title, content, image, fbLink } = req.body;
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