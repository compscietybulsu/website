import mongoose from "mongoose";
import dotenv from "dotenv";
import Leader from "../server/models/Leader.js";

dotenv.config();

const SEED_DATA = [
    { key: "president", name: "Ellah D. Benerado" },
    { key: "chief-of-staff", name: "Jerome S. Teodoro" },
    { key: "internal-vp", name: "Alliah Leona Francisco" },
    { key: "external-vp", name: "Robin Gavriel Elano" },
    { key: "finance", name: "Lester P. Nieva" },
    { key: "secretary", name: "Enzo Ignacio" },
    { key: "membership", name: "Ma. Lhira M. De Leon" },
    { key: "development-core", name: "Gabrielle Sebastian P. Orlanda" },
    { key: "multimedia", name: "Mico Andrei Gonzales" },
    { key: "logistics", name: "Jellian Repana" },
    { key: "events", name: "Eliesha Mae Francisco" },
    { key: "ethics", name: "Mariz Estellei A. Pangilinan" },
];

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const entry of SEED_DATA) {
        await Leader.findOneAndUpdate(
            { key: entry.key },
            { key: entry.key, name: entry.name, photo: "" },
            { upsert: true, new: true }
        );
        console.log(`Seeded ${entry.key}: ${entry.name}`);
    }
    console.log("Done.");
    process.exit(0);
}

run();