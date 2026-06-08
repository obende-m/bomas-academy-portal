import { createFileRoute } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/use-site-content";
import { PageHero } from "./about";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Academics — Bomas Academy" },
      { name: "description", content: "From early years to senior secondary, our curriculum challenges, supports and stretches every learner." },
      { property: "og:title", content: "Academics — Bomas Academy" },
      { property: "og:description", content: "From early years to senior secondary, our curriculum challenges, supports and stretches every learner." },
    ],
  }),
  component: AcademicsPage,
});

function AcademicsPage() {
  const c = useSiteContent();
  const stages = [
    { title: c["academics.early.title"], body: c["academics.early.body"], n: "01" },
    { title: c["academics.primary.title"], body: c["academics.primary.body"], n: "02" },
    { title: c["academics.secondary.title"], body: c["academics.secondary.body"], n: "03" },
  ];
  return (
    <>
      <PageHero eyebrow="Academics" title={c["academics.title"]} subtitle={c["academics.intro"]} />
      <section className="container-wide pb-24">
        <div className="divide-y divide-border border-y border-border">
          {stages.map((s) => (
            <article key={s.n} className="grid gap-6 md:grid-cols-[120px_1fr_2fr] items-baseline py-12 group transition-colors hover:bg-secondary/40 px-2">
              <div className="font-display text-5xl text-accent">{s.n}</div>
              <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}