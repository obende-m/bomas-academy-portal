import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "./about";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — Bomas Academy" },
      { name: "description", content: "Announcements, events and stories from Bomas Academy." },
      { property: "og:title", content: "News — Bomas Academy" },
      { property: "og:description", content: "Announcements, events and stories from Bomas Academy." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data: posts } = useQuery({
    queryKey: ["news_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("id, slug, title, excerpt, cover_image_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      <PageHero eyebrow="Newsroom" title="What's happening at Bomas." />
      <section className="container-wide pb-24">
        {posts && posts.length > 0 ? (
          <div className="divide-y divide-border border-y border-border">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/news/$slug"
                params={{ slug: p.slug }}
                className="grid md:grid-cols-[180px_1fr_280px] gap-8 py-10 items-center group hover:bg-secondary/40 px-2 transition-colors"
              >
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {new Date(p.published_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl group-hover:text-navy">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-muted-foreground line-clamp-2">{p.excerpt}</p>}
                </div>
                {p.cover_image_url && (
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <img src={p.cover_image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No stories yet — check back soon.</p>
        )}
      </section>
    </>
  );
}