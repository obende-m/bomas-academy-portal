import { createFileRoute } from "@tanstack/react-router";
import { Library, FlaskConical, Monitor, Trophy, Music, Utensils } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import { PageHero } from "./about";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Facilities - Bomas Academy" },
      { name: "description", content: "A safe, well-equipped campus designed to support learning, creativity and play." },
      { property: "og:title", content: "Facilities - Bomas Academy" },
      { property: "og:description", content: "A safe, well-equipped campus designed to support learning, creativity and play." },
    ],
  }),
  component: FacilitiesPage,
});

const ICONS = [Library, FlaskConical, Monitor, Trophy, Music, Utensils];

function FacilitiesPage() {
  const c = useSiteContent();
  const items = (c["facilities.items"] || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [title, body] = line.split("|").map((s) => s.trim());
      return { title, body };
    });

  return (
    <>
      <PageHero eyebrow="Facilities" title={c["facilities.title"]} subtitle={c["facilities.intro"]} />
      <section className="container-wide pb-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={item.title} className="group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-navy-deep transition-colors group-hover:bg-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
