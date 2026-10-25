// Organizational chart, A.Y. 2026–2027.
// `photo` points to a 1:1 image in /public/officers. Leave it out and the card shows initials.
// `email` is optional. Add it only with the officer's OK; without it, "Email" goes to the society inbox.
// A team entry with `name: null` is a vacant role and gets an "Apply" button.
// This is the fallback roster. Anyone added in the admin panel (Leaders / Committees)
// replaces the matching entry here by slot key or role; see lib/useOrg.js.

export const ACADEMIC_YEAR = "2026–27";

export const ADVISER = { name: "Aarhus M. Dela Cruz, LPT, MSc", role: "Faculty Adviser" };

// Keys match the admin panel's leader slots (OFFICER_SLOTS in lib/aboutContent.js).
export const EXECUTIVE_KEYS = { president: "president", chiefOfStaff: "chief-of-staff", internalVp: "internal-vp", externalVp: "external-vp" };

export const EXECUTIVES = {
  // baseRole is what a later President gets once someone else takes over in the admin panel.
  president: { name: "Ellah D. Benerado", role: "Founding President", baseRole: "President", photo: "/officers/ellah.jpg" },
  chiefOfStaff: { name: "Jerome S. Teodoro", role: "Chief of Staff", photo: "/officers/jerome.jpg" },
  internalVp: { name: "Alliah Leona Francisco", role: "Internal Vice President", photo: "/officers/alliah.jpg" },
  externalVp: { name: "Robin Gavriel Elano", role: "External Vice President", photo: "/officers/robin.jpg" },
};

export const COMMITTEES = [
  {
    id: "fincom",
    slug: "finance",
    branch: "internal",
    name: "Finance",
    code: "FINCOM",
    about: "Keeps the money transparent through audits, purchasing and fundraising.",
    head: { name: "Lester P. Nieva", role: "Finance Head", photo: "/officers/lester.jpg" },
    team: [{ name: "Jerol Manlapig", role: "Internal Audit Associate", photo: "/officers/jerol.jpg" }],
  },
  {
    id: "seccom",
    slug: "secretary",
    branch: "internal",
    name: "Secretariat",
    code: "SECCOM",
    about: "Keeps documents, member records and archives in order, and handles official letters and emails.",
    head: { name: "Enzo Ignacio", role: "Secretary Head", photo: "/officers/enzo.jpg" },
    team: [
      { name: "Eunice Angeline Cruz", role: "Records Associate", photo: "/officers/eunice.jpg" },
      { name: "Ma. Ellery Brienne Santiago", role: "Correspondence Associate", photo: "/officers/ellery.jpg" },
    ],
  },
  {
    id: "memcom",
    slug: "membership",
    branch: "internal",
    name: "Membership",
    code: "MEMCOM",
    about: "Leads recruitment, onboarding and member retention, with an associate for each year level.",
    head: { name: "Ma. Lhira M. De Leon", role: "Membership Head", photo: "/officers/lhira.jpg" },
    team: [
      { name: null, role: "Freshman Membership Associate" },
      { name: null, role: "Sophomore Membership Associate" },
      { name: null, role: "Junior Membership Associate" },
      { name: null, role: "Senior Membership Associate" },
    ],
  },
  {
    id: "devcor",
    slug: "development-core",
    branch: "internal",
    name: "Developer Core",
    code: "DEV-COR",
    about: "Leads the society's tech projects and runs workshops on software, data and AI, cybersecurity and emerging tech.",
    head: { name: "Gabrielle Sebastian P. Orlanda", role: "Development Core Head", photo: "/officers/gabrielle.jpg" },
    team: [
      { name: "Kirby Benj D. Gutierrez", role: "Technical Operations Associate", photo: "/officers/kirby.jpg" },
      { name: "Lorenz Gabriel Velasco", role: "Software Development Associate", photo: "/officers/lorenz.jpg" },
      { name: "Lorenzo Karl Vergara", role: "Data and AI Associate", photo: "/officers/lorenzo.jpg" },
      { name: "John Carlo Santos", role: "Cybersecurity Associate", photo: "/officers/johncarlo.jpg" },
      { name: "Lance Miguel SD. Evangelista", role: "Technical Innovation Associate", photo: "/officers/lance.jpg" },
    ],
  },
  {
    id: "multicom",
    slug: "multimedia",
    branch: "external",
    name: "Multimedia",
    code: "MULTICOM",
    about: "Owns the creative direction: posters, videos, social media and tech support for livestreams and the website.",
    head: { name: "Mico Andrei Gonzales", role: "Multimedia Head", photo: "/officers/mico.jpg" },
    team: [
      { name: "David James Panuncio", role: "Graphic Design Associate", photo: "/officers/david.jpg" },
      { name: "Brylle James G. Robles", role: "Graphic Design Associate", photo: "/officers/brylle.jpg" },
      { name: "Angel Lorraine Viray", role: "Social Media Associate" },
      { name: null, role: "Technical Support Associate" },
      { name: null, role: "Production Associate" },
    ],
  },
  {
    id: "logcom",
    slug: "logistics",
    branch: "external",
    name: "Logistics",
    code: "LOGCOM",
    about: "Handles resources and planning, coordinates teams, and brings in sponsors and partners.",
    head: { name: "Jellian Repana", role: "Logistics Head", photo: "/officers/jellian.jpg" },
    team: [
      { name: "Angela Mae Palad", role: "Coordination Associate", photo: "/officers/angela.jpg" },
      { name: null, role: "Sponsorship and Partnership Associate" },
      { name: "Kylle Yelhzon Abajo", role: "External Associate", photo: "/officers/kylle.jpg" },
    ],
  },
  {
    id: "evcom",
    slug: "events",
    branch: "external",
    name: "Events",
    code: "EVCOM",
    about: "Plans and runs every major activity, from first idea to post-event evaluation.",
    head: { name: "Eliesha Mae Francisco", role: "Events Head", photo: "/officers/eliesha.jpg" },
    team: [
      { name: null, role: "Programs Associate" },
      { name: null, role: "Community Engagement Associate" },
      { name: null, role: "Feedback and Evaluations Associate" },
      { name: null, role: "Competitions Associate" },
    ],
  },
  {
    id: "ethicom",
    slug: "ethics",
    branch: "external",
    name: "Ethics",
    code: "ETHICOM",
    about: "Upholds the code of conduct and academic integrity in events, and promotes responsible tech and AI.",
    head: { name: "Mariz Estellei A. Pangilinan", role: "Ethics Head", photo: "/officers/mariz.jpg" },
    team: [{ name: "Jester D.R. Pasngadan", role: "Ethics Associate", photo: "/officers/jester.jpg" }],
  },
];

// Officer applications go through this Google Form.
export const APPLY_URL = "https://forms.gle/yyZnuJoMMSwv3qGx8";
