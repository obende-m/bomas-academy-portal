import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";

export function ProgramsOverview() {
  const c = useSiteContent();
  const stages = [
    { title: c["academics.early.title"], body: c["academics.early.body"], n: "01" },
    { title: c["academics.primary.title"], body: c["academics.primary.body"], n: "02" },
    { title: c["academics.secondary.title"], body: c["academics.secondary.body"], n: "03" },
  ];

  return (
    <section className="bg-secondary/60">
      <div className="container-wide py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["home.programs.eyebrow"]}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{c["home.programs.title"]}</h2>
          </div>
          <Link to="/academics" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent">
            View academics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 divide-y divide-border">
          {stages.map((s) => (
            <article key={s.n} className="grid gap-6 md:grid-cols-[120px_1fr_2fr] items-baseline py-12 group transition-colors hover:bg-secondary/40 px-2">
              <div className="font-display text-5xl text-accent">{s.n}</div>
              <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
