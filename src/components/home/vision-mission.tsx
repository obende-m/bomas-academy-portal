import { useSiteContent } from "@/lib/use-site-content";

export function VisionMission() {
  const c = useSiteContent();
  return (
    <section className="bg-secondary/60">
      <div className="container-wide py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["home.visionMission.eyebrow"]}</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground">{c["home.visionMission.title"]}</h2>
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Mission</p>
            <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">{c["about.mission"]}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Vision</p>
            <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">{c["about.vision"]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
