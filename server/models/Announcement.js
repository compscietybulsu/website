import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);