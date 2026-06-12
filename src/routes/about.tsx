import { createFileRoute } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/use-site-content";
import classroomImg from "@/assets/classroom.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Bomas Academy" },
      { name: "description", content: "The story behind Bomas Academy, and the mission and vision guiding our school for the children of Jos." },
      { property: "og:title", content: "About - Bomas Academy" },
      { property: "og:description", content: "The story behind Bomas Academy, and the mission and vision guiding our school for the children of Jos." },
    ],
  }),
  component: AboutPage,
});

export const VALUE_LETTERS: Record<string, string> = {
  bravery: "B",
  opportunity: "O",
  mastery: "M",
  authenticity: "A",
  service: "S",
};

function AboutPage() {
  const c = useSiteContent();
  const values = Object.entries(VALUE_LETTERS).map(([key, letter]) => {
    const [title, body, motto] = (c[`about.values.${key}`] || "").split("\n");
    return { letter, title, body, motto };
  });
  const aims = (c["about.aims.items"] || "").split("\n").filter(Boolean);

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

      <section className="container-wide pb-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">What we stand for</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">The BOMAS Core Values.</h2>
          <p className="mt-4 text-lg text-muted-foreground">{c["about.values.intro"]}</p>
        </div>
        {/* Tablet/desktop: grid of cards */}
        <div className="mt-12 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-5">
          {values.map((v) => (
            <div key={v.letter} className="rounded-2xl bg-secondary/70 p-6 transition-all hover:bg-secondary hover:-translate-y-1">
              <div className="font-display text-4xl text-accent">{v.letter}</div>
              <h3 className="mt-3 font-display text-xl">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              <p className="mt-4 text-sm font-medium italic text-foreground">"{v.motto}"</p>
            </div>
          ))}
        </div>

        {/* Mobile: sticky stacking cards that collapse to a "B - Bravery" header as you scroll */}
        <div className="relative mt-6 sm:hidden">
          {values.map((v, i) => (
            <div
              key={v.letter}
              className="sticky overflow-hidden rounded-3xl bg-secondary shadow-xl ring-1 ring-border/50"
              style={{ top: `calc(5rem + ${i * 3.5}rem)`, height: "22rem", zIndex: i + 1 }}
            >
              <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-secondary px-6">
                <span className="font-display text-2xl text-accent">{v.letter}</span>
                <span className="text-muted-foreground">-</span>
                <span className="font-display text-lg">{v.title}</span>
              </div>
              <div className="px-6 py-6">
                <div className="font-display text-6xl text-accent">{v.letter}</div>
                <h3 className="mt-3 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{v.body}</p>
                <p className="mt-4 text-sm font-medium italic text-foreground">"{v.motto}"</p>
              </div>
            </div>
          ))}
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

      <section className="container-wide py-24">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["about.aims.title"]}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {aims.map((a, i) => (
            <div key={i} className="flex gap-4 rounded-2xl bg-secondary/70 p-6">
              <div className="font-display text-2xl text-accent">0{i + 1}</div>
              <p className="text-lg leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="container-wide pt-12 pb-16 md:pt-16 md:pb-20">
      <p className="reveal text-xs uppercase tracking-[0.32em] text-accent">{eyebrow}</p>
      <h1 className="reveal reveal-delay-1 mt-4 max-w-4xl font-display text-5xl md:text-7xl leading-[1.05]">{title}</h1>
      {subtitle && <p className="reveal reveal-delay-2 mt-6 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
    </section>
  );
}