import { Router } from "express";
import Announcement from "../models/Announcement.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
});

router.get("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json(announcement);
  } catch (err) {
    res.status(400).json({ message: "Invalid announcement id" });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  const { title, description, image, link } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }
  const announcement = await Announcement.create({ title, description, image, link });
  res.status(201).json(announcement);
});

router.put("/:id", verifyAdmin, async (req, res) => {
  const { title, description, image, link } = req.body;
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description, image, link },
      { new: true, runValidators: true }
    );
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json(announcement);
  } catch (err) {
    res.status(400).json({ message: "Invalid announcement id" });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid announcement id" });
  }
});

export default router;