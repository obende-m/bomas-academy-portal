import { createFileRoute } from "@tanstack/react-router";
import { Library, FlaskConical, Monitor, Trophy, Music, Utensils, Smile, HelpCircle } from "lucide-react";
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

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  library: Library,
  science: FlaskConical,
  computer: Monitor,
  ict: Monitor,
  sports: Trophy,
  field: Trophy,
  music: Music,
  arts: Music,
  dining: Utensils,
  hall: Utensils,
  playground: Smile,
};

function getIcon(title: string) {
  const t = title.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (t.includes(key)) return icon;
  }
  return HelpCircle;
}

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
          {items.map((item) => {
            const Icon = getIcon(item.title);
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
