import mongoose from "mongoose";

const LEADER_KEYS = [
    "president",
    "chief-of-staff",
    "internal-vp",
    "external-vp",
    "finance",
    "secretary",
    "membership",
    "development-core",
    "multimedia",
    "logistics",
    "events",
    "ethics",
];

const leaderSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true, enum: LEADER_KEYS },
        name: { type: String, required: true, trim: true },
        photo: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model("Leader", leaderSchema);
export { LEADER_KEYS };