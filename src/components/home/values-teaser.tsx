import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import { VALUE_LETTERS } from "@/routes/about";

export function ValuesTeaser() {
  const c = useSiteContent();
  const values = Object.entries(VALUE_LETTERS).map(([key, letter]) => {
    const [title] = (c[`about.values.${key}`] || "").split("\n");
    return { letter, title };
  });

  return (
    <section className="container-wide py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["home.values.eyebrow"]}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{c["home.values.title"]}</h2>
        </div>
        <Link to="/about" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent">
          Explore our values <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {values.map((v) => (
          <div key={v.letter} className="rounded-2xl bg-secondary/70 p-6 transition-all hover:bg-secondary hover:-translate-y-1">
            <div className="font-display text-4xl text-accent">{v.letter}</div>
            <h3 className="mt-3 font-display text-xl">{v.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
