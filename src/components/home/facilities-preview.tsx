import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import libraryImg from "@/assets/library.jpg";
import computerLabImg from "@/assets/science.jpg";
import playgroundImg from "@/assets/playground.jpg";

const IMAGES = [libraryImg, computerLabImg, playgroundImg];

export function FacilitiesPreview() {
  const c = useSiteContent();
  const items = (c["facilities.items"] || "")
    .split("\n")
    .filter(Boolean)
    .slice(0, 3)
    .map((line) => {
      const [title, body] = line.split("|").map((s) => s.trim());
      return { title, body };
    });

  return (
    <section className="bg-secondary/60">
      <div className="container-wide py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Facilities</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{c["facilities.title"]}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{c["facilities.intro"]}</p>
          </div>
          <Link to="/facilities" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent">
            Explore our facilities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.title}>
              <div className="overflow-hidden rounded-2xl">
                <img src={IMAGES[i % IMAGES.length]} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              </div>
              <h3 className="mt-4 font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
