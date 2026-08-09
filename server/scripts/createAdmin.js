import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

// Always load server/.env next to package.json.
dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"),
});

const [, , username, password] = process.argv;

if (!username || !password) {
  console.log("Usage: node scripts/createAdmin.js <username> <password>");
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate(
    { username: username.toLowerCase() },
    { username: username.toLowerCase(), passwordHash },
    { upsert: true, new: true }
  );
  console.log(`Admin account ready for ${username}`);
  process.exit(0);
}

run();