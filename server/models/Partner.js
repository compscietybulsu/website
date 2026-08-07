import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);