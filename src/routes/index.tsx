import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-campus.jpg";
import { WhyBomas } from "@/components/home/why-bomas";
import { VisionMission } from "@/components/home/vision-mission";
import { ValuesTeaser } from "@/components/home/values-teaser";
import { ProgramsOverview } from "@/components/home/programs-overview";
import { SchoolSnapshot } from "@/components/home/school-snapshot";
import { FacilitiesPreview } from "@/components/home/facilities-preview";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Testimonials } from "@/components/home/testimonials";
import { ContactPreview } from "@/components/home/contact-preview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bomas Academy - Jos, Plateau State" },
      { name: "description", content: "Bomas Academy is a nurturing learning community in Jos shaping confident, curious and compassionate young minds from early years through senior secondary." },
      { property: "og:title", content: "Bomas Academy - Jos, Plateau State" },
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

      <WhyBomas />
      <VisionMission />
      <ValuesTeaser />
      <ProgramsOverview />
      <SchoolSnapshot />
      <FacilitiesPreview />
      <GalleryPreview />

      {latestNews && latestNews.length > 0 && (
        <section className="container-wide py-24 md:py-32">
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

      <Testimonials />

      <section className="container-wide py-24">
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

      <ContactPreview />
    </>
  );
}
