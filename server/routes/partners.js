import { Router } from "express";
import Partner from "../models/Partner.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const partners = await Partner.find().sort({ createdAt: -1 });
  res.json(partners);
});

router.get("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: "Invalid partner id" });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  const { name, detail, image } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  const partner = await Partner.create({ name, detail, image });
  res.status(201).json(partner);
});

router.put("/:id", verifyAdmin, async (req, res) => {
  const { name, detail, image } = req.body;
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { name, detail, image },
      { new: true, runValidators: true }
    );
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: "Invalid partner id" });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json({ message: "Partner deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid partner id" });
  }
});

export default router;