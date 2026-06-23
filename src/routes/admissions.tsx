import { createFileRoute, Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/use-site-content";
import { PageHero } from "./about";
import { ArrowRight } from "lucide-react";
import admissionsImg from "@/assets/admissions-featured.jpg";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions - Bomas Academy" },
      { name: "description", content: "Five simple steps to join the Bomas Academy family in Jos." },
      { property: "og:title", content: "Admissions - Bomas Academy" },
      { property: "og:description", content: "Five simple steps to join the Bomas Academy family in Jos." },
    ],
  }),
  component: AdmissionsPage,
});

function AdmissionsPage() {
  const c = useSiteContent();
  const steps = (c["admissions.steps"] || "").split("\n").filter(Boolean);
  return (
    <>
      <PageHero eyebrow="Admissions" title={c["admissions.title"]} subtitle={c["admissions.intro"]} />
      <section className="container-wide pb-24">
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={i}
              className="rounded-2xl bg-secondary/70 p-8 transition-all hover:bg-secondary hover:-translate-y-1"
            >
              <div className="font-display text-2xl text-accent">0{i + 1}</div>
              <p className="mt-3 font-display text-xl leading-snug">{s.replace(/^\d+\.\s*/, "")}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-8 md:grid-cols-[1.2fr_1fr] items-center rounded-3xl bg-navy-deep p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Ready when you are</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl leading-tight">{c["admissions.cta"]}</h2>
            {c["admissions.phone"] && (
              <a
                href={`tel:${c["admissions.phone"]}`}
                className="mt-3 inline-block text-white/75 hover:text-white text-sm"
              >
                {c["admissions.phone"]}
              </a>
            )}
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:shadow-xl hover:shadow-accent/30 transition-shadow"
              >
                Contact admissions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-lg">
            <img src={admissionsImg} alt="Bomas Academy students" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}