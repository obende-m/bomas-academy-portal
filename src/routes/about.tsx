import { createFileRoute } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/use-site-content";
import classroomImg from "@/assets/classroom.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Bomas Academy" },
      { name: "description", content: "Our story, mission and vision — building a school for the children of Jos." },
      { property: "og:title", content: "About — Bomas Academy" },
      { property: "og:description", content: "Our story, mission and vision — building a school for the children of Jos." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const c = useSiteContent();
  return (
    <>
      <PageHero eyebrow="About" title={c["about.title"]} />
      <section className="container-wide grid gap-16 md:grid-cols-2 pb-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Mission</p>
          <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">{c["about.mission"]}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Vision</p>
          <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">{c["about.vision"]}</p>
        </div>
      </section>
      <section className="bg-secondary/60 py-24">
        <div className="container-wide grid gap-12 md:grid-cols-[1.1fr_1fr] items-center">
          <img src={classroomImg} alt="" className="rounded-2xl aspect-[4/3] object-cover" loading="lazy" />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Our story</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">A school grown on the plateau.</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{c["about.story"]}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="container-wide pt-32 pb-16 md:pt-40 md:pb-20">
      <p className="reveal text-xs uppercase tracking-[0.32em] text-accent">{eyebrow}</p>
      <h1 className="reveal reveal-delay-1 mt-4 max-w-4xl font-display text-5xl md:text-7xl leading-[1.05]">{title}</h1>
      {subtitle && <p className="reveal reveal-delay-2 mt-6 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
    </section>
  );
}