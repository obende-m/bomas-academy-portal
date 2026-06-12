import { useSiteContent } from "@/lib/use-site-content";

export function SchoolSnapshot() {
  const c = useSiteContent();
  const stats = [
    { value: c["home.stats.students"], label: "Students" },
    { value: c["home.stats.teachers"], label: "Teachers" },
    { value: c["home.stats.years"], label: "Years strong" },
  ];

  return (
    <section className="container-wide py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["home.snapshot.eyebrow"]}</p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground">{c["home.snapshot.title"]}</h2>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-border pt-12 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-5xl md:text-6xl text-navy-deep">{s.value}</div>
            <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
