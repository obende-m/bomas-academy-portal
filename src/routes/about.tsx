import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useSiteContent } from "@/lib/use-site-content";
import aboutSlide1 from "@/assets/about-slide-1.jpg";
import aboutSlide2 from "@/assets/about-slide-2.jpg";
import aboutSlide3 from "@/assets/about-slide-3.jpg";
import aboutMissionImg from "@/assets/about-mission.jpg";
import aboutAimsImg from "@/assets/about-aims.jpg";

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

const ABOUT_SLIDES = [
  { src: aboutSlide1, alt: "Bomas Academy students embracing joyfully on the playground" },
  { src: aboutSlide2, alt: "Bomas Academy students sitting together on the playground" },
  { src: aboutSlide3, alt: "Bomas Academy students laughing and hugging on the playground railing" },
];

function AboutImageSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent((index + ABOUT_SLIDES.length) % ABOUT_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ABOUT_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="about-slider group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {ABOUT_SLIDES.map((slide, i) => (
        <img
          key={i}
          src={slide.src}
          alt={slide.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            i === current
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        />
      ))}

      {/* Gradient overlay at bottom for dots */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      {/* Prev / Next buttons */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5">
        {ABOUT_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-7 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

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
      
      {/* Redesigned Mission & Vision Section with split graphic layout */}
      <section className="container-wide grid gap-12 md:grid-cols-[1.2fr_1fr] items-center pb-24">
        <div className="grid gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Mission</p>
            <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">{c["about.mission"]}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Vision</p>
            <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">{c["about.vision"]}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-lg">
          <img src={aboutMissionImg} alt="Bomas Academy Mission & Vision" className="w-full h-full object-cover" />
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

      {/* Our Story section with the new auto-sliding Image Carousel */}
      <section className="bg-secondary/60 py-24">
        <div className="container-wide grid gap-12 md:grid-cols-[1.1fr_1fr] items-center">
          <AboutImageSlider />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Our story</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">A school grown on the plateau.</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{c["about.story"]}</p>
          </div>
        </div>
      </section>

      {/* Redesigned Aims Section with split layout (Graphic left, List right) */}
      <section className="container-wide py-24 grid gap-12 md:grid-cols-[1fr_1.2fr] items-center">
        <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-lg">
          <img src={aboutAimsImg} alt="Bomas Academy students learning" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["about.aims.title"]}</p>
          <div className="mt-8 grid gap-6">
            {aims.map((a, i) => (
              <div key={i} className="flex gap-4 rounded-2xl bg-secondary/70 p-6">
                <div className="font-display text-2xl text-accent">0{i + 1}</div>
                <p className="text-lg leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
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