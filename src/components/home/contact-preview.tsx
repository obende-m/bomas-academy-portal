import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, Phone, Clock } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";

export function ContactPreview() {
  const c = useSiteContent();
  const items = [
    { Icon: MapPin, label: "Campus", value: c["contact.address"] },
    { Icon: Phone, label: "Phone", value: c["contact.phone"] },
    { Icon: Mail, label: "Email", value: c["contact.email"] },
    { Icon: Clock, label: "Office hours", value: c["contact.hours"] },
  ];

  return (
    <section className="container-wide py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">{c["home.contactPreview.eyebrow"]}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{c["home.contactPreview.title"]}</h2>
        </div>
        <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent">
          Contact us <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, label, value }) => (
          <div key={label} className="flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-navy-deep">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
              <div className="mt-1 font-display text-lg text-foreground whitespace-pre-line">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
