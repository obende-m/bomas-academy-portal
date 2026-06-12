import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/lib/use-site-content";

export function GalleryPreview() {
  const c = useSiteContent();
  const { data: images } = useQuery({
    queryKey: ["gallery_home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!images || images.length === 0) return null;

  return (
    <section className="container-wide py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["home.gallery.eyebrow"]}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{c["home.gallery.title"]}</h2>
        </div>
        <Link to="/gallery" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent">
          View full gallery <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {images.map((img, i) => (
          <div key={img.id} className="overflow-hidden rounded-xl bg-secondary group">
            <img
              src={img.image_url}
              alt={img.title ?? ""}
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading={i < 3 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
