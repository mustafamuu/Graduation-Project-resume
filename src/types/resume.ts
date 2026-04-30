export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  photo: string; // base64 data URL, empty = none
  showPhoto: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
  technologies: string;
}

export type TemplateId = "classic" | "modern" | "compact";

export interface ResumeSettings {
  accent: string; // oklch / hex string used as accent color
  template: TemplateId;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  settings: ResumeSettings;
}

export const ACCENT_COLORS = [
  { name: "Slate", value: "#0f172a" },
  { name: "Blue", value: "#2563eb" },
  { name: "Emerald", value: "#059669" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
  { name: "Amber", value: "#d97706" },
];

export const emptyResume: ResumeData = {
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
    photo: "",
    showPhoto: false,
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  settings: { accent: "#2563eb", template: "classic" },
};

export const sampleResume: ResumeData = {
  personal: {
    fullName: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    website: "alexmorgan.dev",
    summary:
      "Results-driven software engineer with 7+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact products used by millions.",
    photo: "",
    showPhoto: false,
  },
  experience: [
    {
      id: "e1",
      company: "TechCorp Inc.",
      position: "Senior Software Engineer",
      startDate: "Jan 2022",
      endDate: "",
      current: true,
      description:
        "Led migration of monolith to microservices, reducing deploy time by 60%.\nMentored 5 junior engineers and established team coding standards.\nArchitected real-time analytics platform serving 2M+ daily active users.",
    },
    {
      id: "e2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      description:
        "Built core product features in React and Node.js from 0 to 100k users.\nImproved API performance by 45% through query optimization and caching.",
    },
  ],
  education: [
    {
      id: "ed1",
      school: "University of California, Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2015",
      endDate: "2019",
      description: "GPA: 3.8/4.0. Dean's List.",
    },
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
  projects: [
    {
      id: "p1",
      name: "OpenSource Analytics",
      link: "github.com/alex/analytics",
      description: "Self-hosted, privacy-first analytics platform with 3k+ GitHub stars.",
      technologies: "Next.js, ClickHouse, TypeScript",
    },
  ],
  settings: { accent: "#2563eb", template: "classic" },
};

export function calcCompletion(d: ResumeData): number {
  const checks: boolean[] = [
    !!d.personal.fullName,
    !!d.personal.title,
    !!d.personal.email,
    !!d.personal.phone,
    !!d.personal.location,
    !!d.personal.summary,
    d.experience.length > 0,
    d.education.length > 0,
    d.skills.length >= 3,
    d.projects.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
