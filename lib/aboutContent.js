export const ABOUT_PARAGRAPH =
  "CompSciety exists to build a strong, united, and future-ready generation of Computer Science students, not merely to keep up with the times, but to define them. Guided by the values of excellence, innovation, integrity, collaboration, and inclusivity, we strive to turn knowledge into action, elevate the role of Computer Science in society, and contribute to the advancement of the field within and beyond the university.";

export const MISSION_VISION = [
  {
    title: "Mission",
    text: "To cultivate a united community of socially responsible, future-ready scholars and innovators committed to excellence, ethical reasoning, and technological advancement in the service of the people and society.",
  },
  {
    title: "Vision",
    text: "To empower students through inclusive education, collaborative innovation, and ethical leadership, fostering a culture of service that responds to the evolving needs of the Filipino nation and the global community.",
  },
];

// Advisers stay static (see SPEC.md) — a single, rarely-changing role.
export const ADVISERS = [
  { name: "Aarhus M. Dela Cruz", role: "Faculty Adviser", photo: "" },
];

// Officers & Executives are now admin-editable (server/models/Leader.js).
// This manifest defines the fixed STRUCTURE only — which roles exist,
// display order, and layout. The actual person's name/photo is fetched
// live from /api/leaders and merged in by `key` at render time, so a
// replacement never needs a code change or redeploy.

export const OFFICER_SLOTS = [
  { key: "president", role: "President", featured: true, order: 1 },
  { key: "internal-vp", role: "Internal Vice President", order: 2 },
  { key: "chief-of-staff", role: "Chief of Staff", order: 3 },
  { key: "external-vp", role: "External Vice President", order: 4 },
];

export const EXECUTIVE_SLOTS = [
  { key: "finance", role: "Finance Head" },
  { key: "secretary", role: "Secretary Head" },
  { key: "membership", role: "Membership Head" },
  { key: "development-core", role: "Development Core Head" },
  { key: "multimedia", role: "Multimedia Head" },
  { key: "logistics", role: "Logistics Head" },
  { key: "events", role: "Events Head" },
  { key: "ethics", role: "Ethics Head" },
];

// Committee "shells" derived from EXECUTIVE_SLOTS — names never drift out
// of sync since there's one source of truth for the role labels.
export const COMMITTEES_META = EXECUTIVE_SLOTS.map((exec) => ({
  slug: exec.key,
  name: exec.role.replace(" Head", " Committee"),
  headRole: exec.role,
}));