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
      <div className="prose prose-lg mt-8 max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
        {data.body}
      </div>
    </article>
  );
}