import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
}

export function ResumePreview({ data }: Props) {
  const { personal, experience, education, skills, projects, settings } = data;
  const accent = settings.accent;
  const template = settings.template;

  const isCompact = template === "compact";
  const isModern = template === "modern";

  const accentStyle = { color: accent } as React.CSSProperties;
  const accentBorder = { borderColor: accent } as React.CSSProperties;

  return (
    <div
      id="resume-print-area"
      className="resume-sheet bg-white text-resume-ink mx-auto animate-fade-in"
      style={{ ["--accent" as any]: accent }}
    >
      <div className={isCompact ? "px-10 py-8" : "px-12 py-10"}>
        {/* Header */}
        <header
          className={`pb-5 mb-6 ${isModern ? "border-l-4 pl-4" : "border-b"}`}
          style={isModern ? accentBorder : { borderColor: "var(--resume-rule)" }}
        >
          <div className="flex items-start gap-5">
            {personal.showPhoto && personal.photo && (
              <img
                src={personal.photo}
                alt={personal.fullName}
                className="h-20 w-20 rounded-full object-cover border-2"
                style={accentBorder}
              />
            )}
            <div className="flex-1 min-w-0">
              <h1
                className={`${isCompact ? "text-[24px]" : "text-[28px]"} font-bold tracking-tight leading-tight`}
                style={isModern ? accentStyle : undefined}
              >
                {personal.fullName || "Your Name"}
              </h1>
              {personal.title && (
                <p className="text-[14px] text-resume-muted mt-1 font-medium">{personal.title}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11.5px] text-resume-muted">
                {personal.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3 w-3" style={accentStyle} aria-hidden /> {personal.email}
                  </span>
                )}
                {personal.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3 w-3" style={accentStyle} aria-hidden /> {personal.phone}
                  </span>
                )}
                {personal.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" style={accentStyle} aria-hidden /> {personal.location}
                  </span>
                )}
                {personal.linkedin && (
                  <span className="inline-flex items-center gap-1.5">
                    <Linkedin className="h-3 w-3" style={accentStyle} aria-hidden /> {personal.linkedin}
                  </span>
                )}
                {personal.website && (
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="h-3 w-3" style={accentStyle} aria-hidden /> {personal.website}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {personal.summary && (
          <Section title="Summary" accent={accent} modern={isModern}>
            <p className="text-[12px] leading-relaxed">{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent={accent} modern={isModern}>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-3">
                    <h3 className="text-[13px] font-semibold">{exp.position || "Position"}</h3>
                    <span className="text-[11px] text-resume-muted whitespace-nowrap">
                      {exp.startDate}
                      {exp.startDate && (exp.current || exp.endDate) ? " – " : ""}
                      {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[12px] italic" style={accentStyle}>
                    {exp.company}
                  </p>
                  {exp.description && (
                    <ul className="mt-1.5 list-disc list-outside ml-4 space-y-0.5 text-[12px] leading-relaxed">
                      {exp.description
                        .split("\n")
                        .filter((l) => l.trim())
                        .map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" accent={accent} modern={isModern}>
            <div className="space-y-3">
              {education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex justify-between items-baseline gap-3">
                    <h3 className="text-[13px] font-semibold">
                      {ed.degree}
                      {ed.degree && ed.field ? ", " : ""}
                      {ed.field}
                    </h3>
                    <span className="text-[11px] text-resume-muted whitespace-nowrap">
                      {ed.startDate}
                      {ed.startDate && ed.endDate ? " – " : ""}
                      {ed.endDate}
                    </span>
                  </div>
                  <p className="text-[12px] italic" style={accentStyle}>
                    {ed.school}
                  </p>
                  {ed.description && (
                    <p className="text-[12px] mt-1 leading-relaxed">{ed.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" accent={accent} modern={isModern}>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="text-[11.5px] px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${accent}14`,
                    color: accent,
                    border: `1px solid ${accent}30`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" accent={accent} modern={isModern}>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline gap-3">
                    <h3 className="text-[13px] font-semibold">{p.name}</h3>
                    {p.link && (
                      <span className="text-[11px]" style={accentStyle}>
                        {p.link}
                      </span>
                    )}
                  </div>
                  {p.technologies && (
                    <p className="text-[11.5px] text-resume-muted italic">{p.technologies}</p>
                  )}
                  {p.description && (
                    <p className="text-[12px] mt-1 leading-relaxed">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  accent,
  modern,
}: {
  title: string;
  children: React.ReactNode;
  accent: string;
  modern: boolean;
}) {
  return (
    <section className="mb-5">
      <h2
        className="text-[12px] font-bold uppercase tracking-[0.12em] pb-1 mb-2.5 border-b"
        style={
          modern
            ? { color: accent, borderColor: accent }
            : { borderColor: "var(--resume-rule)" }
        }
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
