import { BookOpen, Heart, Sparkles } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";

export function WhyBomas() {
  const c = useSiteContent();
  return (
    <section className="container-wide py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">Why Bomas?</p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-foreground">{c["home.intro.title"]}</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{c["home.intro.body"]}</p>
      </div>
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        <Pillar icon={<BookOpen className="h-6 w-6" />} title={c["home.why.item1.title"]} body={c["home.why.item1.body"]} />
        <Pillar icon={<Heart className="h-6 w-6" />} title={c["home.why.item2.title"]} body={c["home.why.item2.body"]} />
        <Pillar icon={<Sparkles className="h-6 w-6" />} title={c["home.why.item3.title"]} body={c["home.why.item3.body"]} />
      </div>
    </section>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="group">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-navy-deep transition-colors group-hover:bg-accent">
        {icon}
      </div>
      <h3 className="mt-6 font-display text-xl text-foreground">{title}</h3>
      <p className="mt-3 text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
