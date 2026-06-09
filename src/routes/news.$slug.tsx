import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({
    meta: [{ title: "Story — Bomas Academy" }],
  }),
  component: NewsDetail,
  notFoundComponent: () => (
    <div className="container-wide py-32 text-center">
      <h1 className="font-display text-4xl">Story not found</h1>
      <Link to="/news" className="mt-6 inline-block text-accent">Back to news</Link>
    </div>
  ),
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["news_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="container-wide py-32 text-muted-foreground">Loading…</div>;
  if (!data) throw notFound();

  return (
    <article className="container-wide pt-32 pb-24 max-w-3xl">
      <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to news
      </Link>
      <p className="mt-10 text-xs uppercase tracking-[0.28em] text-accent">
        {new Date(data.published_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05]">{data.title}</h1>
      {data.cover_image_url && (
        <img src={data.cover_image_url} alt="" className="mt-10 w-full rounded-2xl aspect-[16/9] object-cover" />
      )}
      {data.excerpt && <p className="mt-10 text-xl text-muted-foreground leading-relaxed">{data.excerpt}</p>}
      <NewsBody body={data.body} />
    </article>
  );
}

function NewsBody({ body }: { body: string }) {
  // Lightweight renderer: supports paragraphs and markdown images: ![alt](url)
  const blocks = body.split(/\n{2,}/);
  const imgRe = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/;
  return (
    <div className="mt-10 space-y-6 text-foreground/90 leading-relaxed text-lg">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        const m = trimmed.match(imgRe);
        if (m) {
          return (
            <img
              key={i}
              src={m[2]}
              alt={m[1]}
              loading="lazy"
              className="w-full rounded-2xl aspect-[4/3] object-cover bg-secondary"
            />
          );
        }
        // mixed lines — split by single newline, render images inline as standalone blocks
        const lines = trimmed.split(/\n/);
        if (lines.some((l) => imgRe.test(l.trim()))) {
          return (
            <div key={i} className="space-y-6">
              {lines.map((l, j) => {
                const im = l.trim().match(imgRe);
                if (im) {
                  return (
                    <img
                      key={j}
                      src={im[2]}
                      alt={im[1]}
                      loading="lazy"
                      className="w-full rounded-2xl aspect-[4/3] object-cover bg-secondary"
                    />
                  );
                }
                return l.trim() ? <p key={j}>{l}</p> : null;
              })}
            </div>
          );
        }
        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}