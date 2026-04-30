import { useState } from "react";
import { Sparkles, X, ChevronRight, ChevronLeft, FileText, Palette, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "resume-builder-intro-seen:v1";

interface Step {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Welcome to Resume Builder",
    body: "Build a clean, ATS-friendly resume in minutes. Your progress saves automatically in this browser.",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Fill the form, see it live",
    body: "Edit on the left — the preview on the right updates in real time as you type.",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Make it yours",
    body: "Pick an accent color, switch templates, and optionally add a profile photo for portfolio-style resumes.",
  },
  {
    icon: <Download className="h-5 w-5" />,
    title: "Export as PDF",
    body: "Hit Download PDF anytime. Print styles strip the UI so only the resume sheet exports cleanly.",
  },
];

export function IntroTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const isLast = step === STEPS.length - 1;
  const s = STEPS[step];

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border bg-background shadow-2xl p-6 animate-scale-in">
        <button
          onClick={finish}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background mb-4">
          {s.icon}
        </div>

        <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>

        {/* dots */}
        <div className="flex items-center gap-1.5 mt-6">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-foreground" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          {isLast ? (
            <Button size="sm" onClick={finish}>
              Get started
            </Button>
          ) : (
            <Button size="sm" onClick={() => setStep((s) => s + 1)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        <button
          onClick={finish}
          className="mt-3 block mx-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}

export function shouldShowIntro(): boolean {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}
