import mongoose from "mongoose";

const COMMITTEE_SLUGS = [
  "finance",
  "secretary",
  "membership",
  "development-core",
  "multimedia",
  "logistics",
  "events",
  "ethics",
];

const committeeMemberSchema = new mongoose.Schema(
  {
    committeeSlug: { type: String, required: true, enum: COMMITTEE_SLUGS },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("CommitteeMember", committeeMemberSchema);
export { COMMITTEE_SLUGS };