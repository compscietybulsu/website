import { Router } from "express";
import CommitteeMember from "../models/CommitteeMember.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const members = await CommitteeMember.find().sort({ committeeSlug: 1, createdAt: 1 });
  res.json(members);
});

router.get("/:id", async (req, res) => {
  try {
    const member = await CommitteeMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Committee member not found" });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: "Invalid member id" });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  const { committeeSlug, name, role, photo } = req.body;
  if (!committeeSlug || !name || !role) {
    return res.status(400).json({ message: "Committee, name, and role are required" });
  }
  const member = await CommitteeMember.create({ committeeSlug, name, role, photo });
  res.status(201).json(member);
});

router.put("/:id", verifyAdmin, async (req, res) => {
  const { committeeSlug, name, role, photo } = req.body;
  try {
    const member = await CommitteeMember.findByIdAndUpdate(
      req.params.id,
      { committeeSlug, name, role, photo },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ message: "Committee member not found" });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: "Invalid member id" });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const member = await CommitteeMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Committee member not found" });
    res.json({ message: "Committee member deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid member id" });
  }
});

export default router;