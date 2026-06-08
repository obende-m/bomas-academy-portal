import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-campus.jpg";
import classroomImg from "@/assets/classroom.jpg";
import scienceImg from "@/assets/science.jpg";
import playgroundImg from "@/assets/playground.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bomas Academy — Jos, Plateau State" },
      { name: "description", content: "Bomas Academy is a nurturing learning community in Jos shaping confident, curious and compassionate young minds from early years through senior secondary." },
      { property: "og:title", content: "Bomas Academy — Jos, Plateau State" },
      { property: "og:description", content: "A nurturing learning community in Jos shaping confident, curious and compassionate young minds." },
    ],
  }),
  component: Index,
});

function Index() {
  const c = useSiteContent();
  const { data: latestNews } = useQuery({
    queryKey: ["news_home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("id, slug, title, excerpt, cover_image_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <>
      <section className="relative -mt-20 min-h-[100svh] overflow-hidden bg-navy-deep text-[oklch(0.98_0.005_85)]">
        <img src={heroImg} alt="Bomas Academy students" className="absolute inset-0 h-full w-full object-cover opacity-55" width={1600} height={1100} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/40 via-navy-deep/55 to-navy-deep" />
        <div className="relative container-wide flex min-h-[100svh] flex-col justify-end pb-20 pt-32">
          <p className="reveal text-xs uppercase tracking-[0.32em] text-accent">{c["home.hero.eyebrow"]}</p>
          <h1 className="reveal reveal-delay-1 mt-6 max-w-4xl font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.02] text-white">
            {c["home.hero.title"]}
          </h1>
          <p className="reveal reveal-delay-2 mt-8 max-w-2xl text-lg leading-relaxed text-white/80">
            {c["home.hero.subtitle"]}
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link to="/admissions" className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:shadow-xl hover:shadow-accent/30">
              Begin admissions
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
              Discover our story
            </Link>
          </div>
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Our school</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-foreground">{c["home.intro.title"]}</h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">{c["home.intro.body"]}</p>
            <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
              <Stat value={c["home.stats.students"]} label="Students" />
              <Stat value={c["home.stats.teachers"]} label="Teachers" />
              <Stat value={c["home.stats.years"]} label="Years strong" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="container-wide py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">What we stand for</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground">Three commitments to every child.</h2>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <Pillar icon={<BookOpen className="h-6 w-6" />} title="Rigorous, joyful learning" body="A curriculum that meets each learner where they are, then takes them further than they thought possible." />
            <Pillar icon={<Heart className="h-6 w-6" />} title="Character first" body="Discipline, integrity, and empathy taught not as subjects but as a daily way of being on campus." />
            <Pillar icon={<Sparkles className="h-6 w-6" />} title="Made for Jos" body="Rooted in our highland community and connected to a wider world — proudly Plateau, proudly Nigerian." />
          </div>
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <img src={classroomImg} alt="Primary classroom" className="col-span-12 md:col-span-7 aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />
          <img src={scienceImg} alt="Science lab" className="col-span-6 md:col-span-5 aspect-[4/5] w-full rounded-2xl object-cover" loading="lazy" />
          <img src={playgroundImg} alt="Children playing" className="col-span-6 md:col-span-5 md:col-start-8 aspect-square md:aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />
        </div>
      </section>

      {latestNews && latestNews.length > 0 && (
        <section className="container-wide pb-24 md:pb-32">
          <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-accent">Latest</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">From our newsroom</h2>
            </div>
            <Link to="/news" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent">
              All stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {latestNews.map((n) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group block">
                {n.cover_image_url ? (
                  <div className="overflow-hidden rounded-xl bg-muted aspect-[4/3]">
                    <img src={n.cover_image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-xl marquee-gold" />
                )}
                <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                  {new Date(n.published_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-navy">{n.title}</h3>
                {n.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-wide pb-24">
        <div className="rounded-3xl bg-navy-deep px-8 py-16 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          <p className="relative text-xs uppercase tracking-[0.32em] text-accent">Join the Bomas family</p>
          <h2 className="relative mt-4 font-display text-4xl md:text-5xl">Bring your child to a school that sees them.</h2>
          <p className="relative mx-auto mt-6 max-w-xl text-white/70">Book a campus visit, meet our teachers, and learn how Bomas Academy nurtures every learner.</p>
          <Link to="/admissions" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:shadow-xl hover:shadow-accent/40 transition-shadow">
            Start admissions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-navy-deep">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
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