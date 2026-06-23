import { createFileRoute } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/use-site-content";
import { PageHero } from "./about";
import academicEarlyImg from "@/assets/academic-early.jpg";
import academicPrimaryImg from "@/assets/academic-primary.jpg";
import academicSecondaryImg from "@/assets/academic-secondary.jpg";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Academics - Bomas Academy" },
      { name: "description", content: "From early years to senior secondary, our curriculum challenges, supports and stretches every learner." },
      { property: "og:title", content: "Academics - Bomas Academy" },
      { property: "og:description", content: "From early years to senior secondary, our curriculum challenges, supports and stretches every learner." },
    ],
  }),
  component: AcademicsPage,
});

function AcademicsPage() {
  const c = useSiteContent();
  const stages = [
    { title: c["academics.early.title"], body: c["academics.early.body"], n: "01", image: academicEarlyImg },
    { title: c["academics.primary.title"], body: c["academics.primary.body"], n: "02", image: academicPrimaryImg },
    { title: c["academics.secondary.title"], body: c["academics.secondary.body"], n: "03", image: academicSecondaryImg },
  ];
  return (
    <>
      <PageHero eyebrow="Academics" title={c["academics.title"]} subtitle={c["academics.intro"]} />
      <section className="container-wide pb-24">
        <div className="divide-y divide-border border-y border-border">
          {stages.map((s) => (
            <article key={s.n} className="grid gap-6 md:grid-cols-[120px_1.5fr_2.5fr_1.5fr] items-center py-12 group transition-colors hover:bg-secondary/40 px-4 rounded-2xl">
              <div className="font-display text-5xl text-accent">{s.n}</div>
              <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">{s.body}</p>
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-md">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}