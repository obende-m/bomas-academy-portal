import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "./about";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff — Bomas Academy" },
      { name: "description", content: "Meet the teachers and leaders shaping Bomas Academy." },
      { property: "og:title", content: "Staff — Bomas Academy" },
      { property: "og:description", content: "Meet the teachers and leaders shaping Bomas Academy." },
    ],
  }),
  component: StaffPage,
});

function StaffPage() {
  const { data: staff } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      <PageHero eyebrow="Our people" title="Teachers who know your child by name." subtitle="A team of dedicated educators, mentors and leaders chosen for their craft and their character." />
      <section className="container-wide pb-24">
        {staff && staff.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((s) => (
              <article key={s.id} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
                  {s.photo_url ? (
                    <img src={s.photo_url} alt={s.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="h-full w-full marquee-gold" />
                  )}
                </div>
                <h3 className="mt-5 font-display text-xl">{s.name}</h3>
                <p className="text-sm uppercase tracking-widest text-accent">{s.position}</p>
                {s.bio && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.bio}</p>}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Staff profiles will appear here soon.</p>
        )}
      </section>
    </>
  );
}