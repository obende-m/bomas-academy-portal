import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "./about";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery - Bomas Academy" },
      { name: "description", content: "Moments from life at Bomas Academy, including classrooms, events, sports and more." },
      { property: "og:title", content: "Gallery - Bomas Academy" },
      { property: "og:description", content: "Moments from life at Bomas Academy, including classrooms, events, sports and more." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: images } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      <PageHero eyebrow="Gallery" title="Life at Bomas, in pictures." />
      <section className="container-wide pb-24">
        {images && images.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
            {images.map((img, i) => (
              <figure key={img.id} className="break-inside-avoid overflow-hidden rounded-xl bg-secondary group">
                <img
                  src={img.image_url}
                  alt={img.title ?? ""}
                  className="w-full transition-transform duration-700 group-hover:scale-105"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                {img.title && (
                  <figcaption className="px-4 py-3 text-sm text-muted-foreground">{img.title}</figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Photos coming soon.</p>
        )}
      </section>
    </>
  );
}