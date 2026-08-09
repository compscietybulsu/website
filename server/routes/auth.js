import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Admin from "../models/Admin.js";

const router = Router();

// A real bcrypt hash of an unused, throwaway string. Never corresponds to
// an actual password. Used only so bcrypt.compare() always has something
// valid to hash against, even when no matching admin was found — see the
// timing note below.
const DUMMY_HASH = "$2b$10$BhRyS4jCwFaVlKnVE00I6eSZ3E8TCyLWZ2NwSoM8hv4FJpR0mZNye";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 failed attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only failed logins count toward the limit
  message: { message: "Too many login attempts. Please try again in a few minutes." },
});

router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const admin = await Admin.findOne({ username: username.toLowerCase() });

  // Always run bcrypt.compare, even when no admin was found, hashing
  // against DUMMY_HASH in that case. bcrypt.compare is deliberately slow
  // (~10 rounds), so skipping it for "user doesn't exist" would make that
  // path measurably faster than "user exists, wrong password" — letting
  // an attacker enumerate valid usernames purely by timing the response,
  // even though the error message itself is identical either way.
  const match = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);

  if (!admin || !match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.json({ token, username: admin.username });
});

export default router;