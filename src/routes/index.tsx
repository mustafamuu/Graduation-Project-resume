import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  FileText,
  RotateCcw,
  Sparkles,
  Palette,
  HelpCircle,
  Upload,
  FileJson,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { IntroTour, shouldShowIntro } from "@/components/resume/IntroTour";
import { useResumeData } from "@/hooks/useResumeData";
import { ACCENT_COLORS, calcCompletion, TemplateId } from "@/types/resume";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/")({
  component: Index,
});

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: "classic", label: "Classic", desc: "Timeless serif-free layout" },
  { id: "modern", label: "Modern", desc: "Accent color & side bar" },
  { id: "compact", label: "Compact", desc: "Tighter spacing, fits more" },
];

function Index() {
  const { data, setData, clear, loadSample, hydrated } = useResumeData();
  const [introOpen, setIntroOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hydrated && shouldShowIntro()) setIntroOpen(true);
  }, [hydrated]);

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  const completion = calcCompletion(data);

  const setAccent = (accent: string) =>
    setData((d) => ({ ...d, settings: { ...d.settings, accent } }));
  const setTemplate = (template: TemplateId) =>
    setData((d) => ({ ...d, settings: { ...d.settings, template } }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.personal.fullName || "resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        setData((d) => ({ ...d, ...parsed }));
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-app-canvas">
      <IntroTour open={introOpen} onClose={() => setIntroOpen(false)} />

      {/* Top bar — hidden on print */}
      <header className="no-print sticky top-0 z-10 border-b bg-background/80 backdrop-blur animate-fade-in">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background hover-scale">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">Resume Builder</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {completion}% complete • Auto-saved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Color picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Palette className="h-4 w-4 mr-1.5" />
                  <span
                    className="h-3 w-3 rounded-full border"
                    style={{ backgroundColor: data.settings.accent }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <p className="text-xs font-medium mb-2">Accent color</p>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAccent(c.value)}
                      className="relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c.value,
                        borderColor:
                          data.settings.accent === c.value ? c.value : "transparent",
                        boxShadow:
                          data.settings.accent === c.value
                            ? `0 0 0 2px var(--background), 0 0 0 4px ${c.value}`
                            : undefined,
                      }}
                      aria-label={c.name}
                    >
                      {data.settings.accent === c.value && (
                        <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <label className="text-xs font-medium block mb-1.5">Custom</label>
                <input
                  type="color"
                  value={data.settings.accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-9 w-full rounded cursor-pointer border"
                />

                <p className="text-xs font-medium mt-4 mb-2">Template</p>
                <div className="space-y-1">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`w-full text-left rounded-md p-2 text-xs transition-colors ${
                        data.settings.template === t.id
                          ? "bg-foreground text-background"
                          : "hover:bg-accent"
                      }`}
                    >
                      <div className="font-medium">{t.label}</div>
                      <div
                        className={`text-[10.5px] ${
                          data.settings.template === t.id
                            ? "text-background/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" onClick={() => setIntroOpen(true)}>
              <HelpCircle className="h-4 w-4 mr-1.5" /> Tour
            </Button>

            <Button variant="ghost" size="sm" onClick={loadSample}>
              <Sparkles className="h-4 w-4 mr-1.5" /> Sample
            </Button>

            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => importJson(e.target.files?.[0])}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => importRef.current?.click()}
              title="Import JSON"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={exportJson} title="Export JSON">
              <FileJson className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your saved resume from this browser. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clear}>Clear data</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button size="sm" onClick={() => window.print()} className="hover-scale">
              <Download className="h-4 w-4 mr-1.5" /> Download PDF
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 pb-2">
          <Progress value={completion} className="h-1" />
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <section className="no-print rounded-xl border bg-background shadow-sm animate-fade-in">
            <div className="p-6 lg:h-[calc(100vh-10rem)] flex flex-col">
              <ResumeForm data={data} setData={setData} />
            </div>
          </section>

          {/* Preview */}
          <section className="print-area">
            <div className="lg:sticky lg:top-24">
              <div className="lg:h-[calc(100vh-10rem)] lg:overflow-y-auto rounded-xl bg-resume-bg p-4 lg:p-8 shadow-sm border print:p-0 print:border-0 print:bg-white print:shadow-none print:overflow-visible">
                <ResumePreview data={data} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
