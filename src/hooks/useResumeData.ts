import { useEffect, useState } from "react";
import { ResumeData, emptyResume, sampleResume } from "@/types/resume";

const STORAGE_KEY = "resume-builder-data:v2";

function migrate(raw: any): ResumeData {
  // Backfill missing fields from older saves
  const base: ResumeData = { ...emptyResume, ...raw };
  base.personal = { ...emptyResume.personal, ...(raw?.personal ?? {}) };
  base.settings = { ...emptyResume.settings, ...(raw?.settings ?? {}) };
  base.experience = raw?.experience ?? [];
  base.education = raw?.education ?? [];
  base.skills = raw?.skills ?? [];
  base.projects = raw?.projects ?? [];
  return base;
}

export function useResumeData() {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(migrate(JSON.parse(raw)));
      } else {
        setData(sampleResume);
      }
    } catch {
      setData(sampleResume);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  }, [data, hydrated]);

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(emptyResume);
  };

  const loadSample = () => setData(sampleResume);

  return { data, setData, clear, loadSample, hydrated };
}
