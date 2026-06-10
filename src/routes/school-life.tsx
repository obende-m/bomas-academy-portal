import { createFileRoute } from "@tanstack/react-router";
import { Clock, Shirt, Sparkles, MessageCircle, Users, DoorOpen, ShieldCheck, HeartPulse, Globe2 } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import { PageHero } from "./about";

export const Route = createFileRoute("/school-life")({
  head: () => ({
    meta: [
      { title: "School Life — Bomas Academy" },
      { name: "description", content: "Campus life, the home-school partnership, homework, health & safety, and our home/school agreement." },
      { property: "og:title", content: "School Life — Bomas Academy" },
      { property: "og:description", content: "Campus life, the home-school partnership, homework, health & safety, and our home/school agreement." },
    ],
  }),
  component: SchoolLifePage,
});

function SchoolLifePage() {
  const c = useSiteContent();

  const campusItems = [
    { Icon: Sparkles, title: c["schoolLife.campus.environment.title"], body: c["schoolLife.campus.environment.body"] },
    { Icon: Clock, title: c["schoolLife.campus.day.title"], body: c["schoolLife.campus.day.body"] },
    { Icon: Shirt, title: c["schoolLife.campus.uniform.title"], body: c["schoolLife.campus.uniform.body"] },
  ];

  const partnershipItems = [
    { Icon: MessageCircle, title: c["schoolLife.partnership.communication.title"], body: c["schoolLife.partnership.communication.body"] },
    { Icon: Users, title: c["schoolLife.partnership.family.title"], body: c["schoolLife.partnership.family.body"] },
    { Icon: DoorOpen, title: c["schoolLife.partnership.headteacher.title"], body: c["schoolLife.partnership.headteacher.body"] },
  ];

  const healthItems = [
    { Icon: ShieldCheck, title: c["schoolLife.health.behaviour.title"], body: c["schoolLife.health.behaviour.body"] },
    { Icon: HeartPulse, title: c["schoolLife.health.wellness.title"], body: c["schoolLife.health.wellness.body"] },
    { Icon: Globe2, title: c["schoolLife.health.inclusion.title"], body: c["schoolLife.health.inclusion.body"] },
  ];

  const homeworkBands = (c["schoolLife.homework.bands"] || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [stage, time] = line.split("|").map((s) => s.trim());
      return { stage, time };
    });

  const agreementRows = (c["schoolLife.agreement.rows"] || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [child, family, school] = line.split("|").map((s) => s.trim());
      return { child, family, school };
    });

  return (
    <>
      <PageHero eyebrow="School Life" title={c["schoolLife.title"]} subtitle={c["schoolLife.intro"]} />

      <section className="container-wide pb-24">
        <h2 className="font-display text-3xl md:text-4xl">{c["schoolLife.campus.title"]}</h2>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {campusItems.map((item) => (
            <Feature key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl">{c["schoolLife.partnership.title"]}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{c["schoolLife.partnership.intro"]}</p>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {partnershipItems.map((item) => (
              <Feature key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] items-start">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">{c["schoolLife.homework.title"]}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{c["schoolLife.homework.intro"]}</p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {homeworkBands.map((b) => (
              <div key={b.stage} className="flex items-center justify-between gap-6 py-5">
                <span className="font-display text-lg">{b.stage}</span>
                <span className="text-sm uppercase tracking-widest text-accent">{b.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl">{c["schoolLife.health.title"]}</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {healthItems.map((item) => (
              <Feature key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl">{c["schoolLife.agreement.title"]}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{c["schoolLife.agreement.intro"]}</p>
        </div>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-accent">
                <th className="border-b border-border pb-4 pr-6">The Child's Promise</th>
                <th className="border-b border-border pb-4 pr-6">The Family's Promise</th>
                <th className="border-b border-border pb-4">The School's Promise</th>
              </tr>
            </thead>
            <tbody>
              {agreementRows.map((row, i) => (
                <tr key={i} className="align-top">
                  <td className="border-b border-border py-5 pr-6 text-muted-foreground">{row.child}</td>
                  <td className="border-b border-border py-5 pr-6 text-muted-foreground">{row.family}</td>
                  <td className="border-b border-border py-5 text-muted-foreground">{row.school}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Feature({ Icon, title, body }: { Icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="group">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-navy-deep transition-colors group-hover:bg-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 font-display text-xl text-foreground">{title}</h3>
      <p className="mt-3 text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
