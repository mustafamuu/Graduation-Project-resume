import { useRef, useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, X, Upload, ImageOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ResumeData, Experience, Education, Project } from "@/types/resume";

interface Props {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const STEPS = ["Personal", "Experience", "Education", "Skills", "Projects"] as const;

export function ResumeForm({ data, setData }: Props) {
  const [step, setStep] = useState(0);

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  return (
    <div className="flex flex-col h-full">
      {/* Stepper */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              i === step
                ? "bg-foreground text-background scale-105"
                : "bg-secondary text-muted-foreground hover:bg-accent hover:scale-105"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                i === step ? "bg-background text-foreground" : "bg-background text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      <div key={step} className="flex-1 overflow-y-auto pr-1 animate-fade-in">
        {step === 0 && <PersonalStep data={data} update={update} />}
        {step === 1 && <ExperienceStep data={data} update={update} />}
        {step === 2 && <EducationStep data={data} update={update} />}
        {step === 3 && <SkillsStep data={data} update={update} />}
        {step === 4 && <ProjectsStep data={data} update={update} />}
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <span className="text-xs text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </span>
        <Button
          size="sm"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

type Updater = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;

function PersonalStep({ data, update }: { data: ResumeData; update: Updater }) {
  const p = data.personal;
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof p, v: string | boolean) => update("personal", { ...p, [k]: v } as any);

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("photo", String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Personal Information</h3>

      {/* Photo toggle */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Include profile photo?</p>
            <p className="text-xs text-muted-foreground">
              Optional — great for portfolios, often skipped for ATS.
            </p>
          </div>
          <Switch
            checked={p.showPhoto}
            onCheckedChange={(v) => set("showPhoto", !!v)}
          />
        </div>

        {p.showPhoto && (
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-muted overflow-hidden flex items-center justify-center border">
              {p.photo ? (
                <img src={p.photo} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1.5" /> Upload photo
              </Button>
              {p.photo && (
                <button
                  onClick={() => set("photo", "")}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors text-left"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name">
          <Input value={p.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </Field>
        <Field label="Job Title">
          <Input value={p.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={p.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={p.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Location">
          <Input value={p.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="LinkedIn">
          <Input value={p.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
        </Field>
        <Field label="Website" className="col-span-2">
          <Input value={p.website} onChange={(e) => set("website", e.target.value)} />
        </Field>
      </div>
      <Field label="Professional Summary">
        <Textarea
          rows={4}
          value={p.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="2-3 sentences highlighting your strengths and goals."
        />
      </Field>
    </div>
  );
}

function ExperienceStep({ data, update }: { data: ResumeData; update: Updater }) {
  const items = data.experience;
  const add = () =>
    update("experience", [
      ...items,
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  const remove = (id: string) => update("experience", items.filter((i) => i.id !== id));
  const patch = (id: string, p: Partial<Experience>) =>
    update("experience", items.map((i) => (i.id === id ? { ...i, ...p } : i)));

  return (
    <div className="space-y-4">
      <Header title="Work Experience" onAdd={add} />
      {items.length === 0 && <Empty text="No experience yet. Click Add to get started." />}
      {items.map((exp) => (
        <Card key={exp.id} onRemove={() => remove(exp.id)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company">
              <Input value={exp.company} onChange={(e) => patch(exp.id, { company: e.target.value })} />
            </Field>
            <Field label="Position">
              <Input value={exp.position} onChange={(e) => patch(exp.id, { position: e.target.value })} />
            </Field>
            <Field label="Start Date">
              <Input
                placeholder="Jan 2022"
                value={exp.startDate}
                onChange={(e) => patch(exp.id, { startDate: e.target.value })}
              />
            </Field>
            <Field label="End Date">
              <Input
                placeholder="Dec 2024"
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) => patch(exp.id, { endDate: e.target.value })}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={exp.current}
              onCheckedChange={(v) => patch(exp.id, { current: !!v, endDate: v ? "" : exp.endDate })}
            />
            I currently work here
          </label>
          <Field label="Description (one bullet per line)">
            <Textarea
              rows={4}
              value={exp.description}
              onChange={(e) => patch(exp.id, { description: e.target.value })}
              placeholder="Led team of 5 engineers...&#10;Increased performance by 40%..."
            />
          </Field>
        </Card>
      ))}
    </div>
  );
}

function EducationStep({ data, update }: { data: ResumeData; update: Updater }) {
  const items = data.education;
  const add = () =>
    update("education", [
      ...items,
      {
        id: crypto.randomUUID(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  const remove = (id: string) => update("education", items.filter((i) => i.id !== id));
  const patch = (id: string, p: Partial<Education>) =>
    update("education", items.map((i) => (i.id === id ? { ...i, ...p } : i)));

  return (
    <div className="space-y-4">
      <Header title="Education" onAdd={add} />
      {items.length === 0 && <Empty text="No education entries yet." />}
      {items.map((ed) => (
        <Card key={ed.id} onRemove={() => remove(ed.id)}>
          <Field label="School">
            <Input value={ed.school} onChange={(e) => patch(ed.id, { school: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Degree">
              <Input
                placeholder="B.S."
                value={ed.degree}
                onChange={(e) => patch(ed.id, { degree: e.target.value })}
              />
            </Field>
            <Field label="Field of Study">
              <Input value={ed.field} onChange={(e) => patch(ed.id, { field: e.target.value })} />
            </Field>
            <Field label="Start">
              <Input value={ed.startDate} onChange={(e) => patch(ed.id, { startDate: e.target.value })} />
            </Field>
            <Field label="End">
              <Input value={ed.endDate} onChange={(e) => patch(ed.id, { endDate: e.target.value })} />
            </Field>
          </div>
          <Field label="Notes">
            <Textarea
              rows={2}
              value={ed.description}
              onChange={(e) => patch(ed.id, { description: e.target.value })}
            />
          </Field>
        </Card>
      ))}
    </div>
  );
}

function SkillsStep({ data, update }: { data: ResumeData; update: Updater }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v || data.skills.includes(v)) return;
    update("skills", [...data.skills, v]);
    setInput("");
  };
  const remove = (s: string) => update("skills", data.skills.filter((x) => x !== s));

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Skills</h3>
      <p className="text-xs text-muted-foreground">
        Add keywords relevant to your target role. Press Enter to add.
      </p>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. TypeScript"
        />
        <Button type="button" onClick={add} size="sm">
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-sm"
          >
            {s}
            <button
              onClick={() => remove(s)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${s}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsStep({ data, update }: { data: ResumeData; update: Updater }) {
  const items = data.projects;
  const add = () =>
    update("projects", [
      ...items,
      { id: crypto.randomUUID(), name: "", link: "", description: "", technologies: "" },
    ]);
  const remove = (id: string) => update("projects", items.filter((i) => i.id !== id));
  const patch = (id: string, p: Partial<Project>) =>
    update("projects", items.map((i) => (i.id === id ? { ...i, ...p } : i)));

  return (
    <div className="space-y-4">
      <Header title="Projects" onAdd={add} />
      {items.length === 0 && <Empty text="Showcase relevant projects." />}
      {items.map((p) => (
        <Card key={p.id} onRemove={() => remove(p.id)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <Input value={p.name} onChange={(e) => patch(p.id, { name: e.target.value })} />
            </Field>
            <Field label="Link">
              <Input value={p.link} onChange={(e) => patch(p.id, { link: e.target.value })} />
            </Field>
          </div>
          <Field label="Technologies">
            <Input
              value={p.technologies}
              onChange={(e) => patch(p.id, { technologies: e.target.value })}
              placeholder="React, Node.js, PostgreSQL"
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              value={p.description}
              onChange={(e) => patch(p.id, { description: e.target.value })}
            />
          </Field>
        </Card>
      ))}
    </div>
  );
}

/* --- helpers --- */

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Header({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold">{title}</h3>
      <Button size="sm" variant="outline" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
}

function Card({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
