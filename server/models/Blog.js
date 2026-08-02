import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    fbLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);