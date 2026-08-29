import { Router } from "express";
import Leader, { LEADER_KEYS } from "../models/Leader.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
    const leaders = await Leader.find();
    res.json(leaders);
});

router.get("/:key", async (req, res) => {
    if (!LEADER_KEYS.includes(req.params.key)) {
        return res.status(400).json({ message: "Invalid leader key" });
    }
    const leader = await Leader.findOne({ key: req.params.key });
    res.json(leader || { key: req.params.key, name: "", photo: "" });
});

router.put("/:key", verifyAdmin, async (req, res) => {
    const { key } = req.params;
    if (!LEADER_KEYS.includes(key)) {
        return res.status(400).json({ message: "Invalid leader key" });
    }
    const { name, photo } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    const leader = await Leader.findOneAndUpdate(
        { key },
        { key, name, photo },
        { new: true, upsert: true, runValidators: true }
    );
    res.json(leader);
});

export default router;