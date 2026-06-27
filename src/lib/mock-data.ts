export type CustomField = {
  name: string;
  type: "text" | "number" | "dropdown";
  options?: string[];
};

export type EventDocument = {
  heading: string;
  url: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "upcoming" | "past";
  registrationType?: "Free" | "Paid via Google Form" | "Paid via Razorpay";
  formLink?: string;
  cover?: string;
  rules?: string[];
  schedule?: { time: string; item: string }[];
  problemStatementUrl?: string;
  problemStatementLocked?: boolean;
  photos?: string[];
  customFields?: CustomField[];
  notes?: string;
  documents?: EventDocument[];
  isPaid?: boolean;
  amount?: number;
};

export const EVENTS: EventItem[] = [
  {
    id: "founders-pitch-2026",
    title: "Founder's Pitch 2026",
    description:
      "Our flagship pitch competition where student founders present ventures to a panel of investors, alumni, and faculty.",
    date: "2026-08-22",
    status: "upcoming",
    registrationType: "Paid via Google Form",
    isPaid: true,
    formLink: "https://forms.gle/example",
    cover: "linear-gradient(135deg,#A50000,#1E1E1E)",
    rules: [
      "Teams of up to 4 members from any MUJ batch.",
      "8-minute pitch + 4-minute Q&A.",
      "Problem statement unlocks 48 hours before the event.",
    ],
    schedule: [
      { time: "10:00", item: "Registration & Breakfast" },
      { time: "11:00", item: "Opening Keynote" },
      { time: "12:00", item: "Round 1 Pitches" },
      { time: "16:00", item: "Finals & Awards" },
    ],
    problemStatementLocked: true,
    notes:
      "Please carry a physical copy of your college ID card for registration confirmation at the venue.",
    customFields: [
      { name: "T-Shirt Size", type: "dropdown", options: ["S", "M", "L", "XL"] },
      { name: "Dietary Restrictions", type: "text" },
    ],
    documents: [
      { heading: "Rules & Guidelines Booklet", url: "https://example.com/rules.pdf" },
      { heading: "Pitch Deck Template", url: "https://example.com/deck-template.pptx" },
    ],
  },
  {
    id: "ideathon-spring",
    title: "Spring Ideathon",
    description:
      "A 24-hour ideation sprint for first and second-year students — no prior experience required.",
    date: "2026-03-14",
    status: "upcoming",
    registrationType: "Free",
    isPaid: false,
    cover: "linear-gradient(135deg,#E8A020,#A50000)",
    rules: ["Solo or pairs", "Free to enter", "Top 3 ideas get incubation support"],
  },
  {
    id: "startup-bazaar",
    title: "Startup Bazaar 2025",
    description: "Student ventures sold products and services across campus over a weekend market.",
    date: "2025-10-04",
    status: "past",
    registrationType: "Free",
    isPaid: false,
    cover: "linear-gradient(135deg,#1E1E1E,#A50000)",
    photos: [],
  },
  {
    id: "vc-talks-fall",
    title: "VC Talks: Fall Edition",
    description:
      "An intimate fireside chat with early-stage investors covering fundraising, term sheets, and traction.",
    date: "2025-09-18",
    status: "past",
    registrationType: "Free",
    isPaid: false,
    cover: "linear-gradient(135deg,#E8A020,#1E1E1E)",
    photos: [],
  },
];

export const ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "Recruitment Season is Open",
    body: "Applications for the 2026 cohort are now open across all five domains. Apply via the Join Us page.",
    date: "2026-01-12",
  },
  {
    id: "a2",
    title: "Founder's Pitch 2026 dates announced",
    body: "Mark your calendars — August 22nd. Registrations open in July.",
    date: "2026-01-05",
  },
];

export const TEAM = [
  {
    id: "1",
    name: "Aarav Mehta",
    role: "President",
    domain: "Leadership",
    year: "Final Year",
    bio: "Builder, operator, and habitual coffee drinker.",
    tier: "Executive",
  },
  {
    id: "2",
    name: "Ishita Rao",
    role: "Vice President",
    domain: "Leadership",
    year: "Final Year",
    bio: "Leads cross-domain initiatives and external partnerships.",
    tier: "Executive",
  },
  {
    id: "3",
    name: "Kabir Singh",
    role: "Head of Events",
    domain: "Events",
    year: "Third Year",
    bio: "Runs the calendar — from ideathons to flagship pitches.",
    tier: "Core team",
  },
  {
    id: "4",
    name: "Maya Verma",
    role: "Head of Finance",
    domain: "Finance",
    year: "Third Year",
    bio: "Keeps the books, the budgets, and the sponsors honest.",
    tier: "Core team",
  },
  {
    id: "5",
    name: "Rohan Patel",
    role: "Head of Marketing",
    domain: "Marketing",
    year: "Third Year",
    bio: "Owns brand voice, campaigns, and growth.",
    tier: "Core team",
  },
  {
    id: "6",
    name: "Sara Kapoor",
    role: "Head of Design",
    domain: "Design",
    year: "Second Year",
    bio: "Designs every poster, deck, and pixel you see.",
    tier: "Core team",
  },
  {
    id: "7",
    name: "Vihaan Joshi",
    role: "Head of Social Media",
    domain: "Media",
    year: "Second Year",
    bio: "Lives on Instagram so you don't have to.",
    tier: "Core team",
  },
  {
    id: "8",
    name: "Neha Iyer",
    role: "Head of Media",
    domain: "Media",
    year: "Third Year",
    bio: "Captures every moment behind the lens.",
    tier: "Core team",
  },
  {
    id: "9",
    name: "Shifa Sheikh",
    role: "Club Coordinator",
    domain: "Leadership",
    year: "Third Year",
    bio: "Coordinates all club activities, domain tasks, and event schedules.",
    tier: "Club coordinator",
  },
];

export const DOMAINS = [
  {
    name: "Events",
    blurb: "Plan and execute everything from intimate workshops to flagship competitions.",
  },
  {
    name: "Finance",
    blurb: "Manage club budgets, sponsorships, and the financial side of every venture.",
  },
  { name: "Marketing", blurb: "Craft campaigns, partnerships, and the story we tell the campus." },
  {
    name: "Design",
    blurb: "Own the visual identity — posters, decks, swag, and the website you're on.",
  },
  {
    name: "Media",
    blurb: "Photography, videography, social media presence, and the archive of every moment.",
  },
];
