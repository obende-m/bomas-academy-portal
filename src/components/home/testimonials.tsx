import { useSiteContent } from "@/lib/use-site-content";

export function Testimonials() {
  const c = useSiteContent();
  const items = (c["home.testimonials.items"] || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, role, quote] = line.split("|").map((s) => s.trim());
      return { name, role, quote };
    });

  return (
    <section className="bg-secondary/60">
      <div className="container-wide py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["home.testimonials.eyebrow"]}</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground">{c["home.testimonials.title"]}</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.name} className="rounded-2xl bg-background p-6 ring-1 ring-border/50">
              <p className="text-lg leading-relaxed text-foreground">"{item.quote}"</p>
              <div className="mt-6 font-display text-lg">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
