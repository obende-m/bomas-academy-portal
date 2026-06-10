import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Youtube, X as XIcon } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import { PageHero } from "./about";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bomas Academy" },
      { name: "description", content: "Get in touch with the Bomas Academy admissions and main office in Jos, Plateau State." },
      { property: "og:title", content: "Contact — Bomas Academy" },
      { property: "og:description", content: "Get in touch with the Bomas Academy admissions and main office in Jos, Plateau State." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const c = useSiteContent();
  const items = [
    { Icon: MapPin, label: "Campus", value: c["contact.address"] },
    { Icon: Phone, label: "Phone", value: c["contact.phone"] },
    { Icon: Mail, label: "Email", value: c["contact.email"] },
    { Icon: Clock, label: "Office hours", value: c["contact.hours"] },
  ];
  const socials = [
    { Icon: Facebook, href: c["contact.facebook"], label: "Facebook" },
    { Icon: Instagram, href: c["contact.instagram"], label: "Instagram" },
    { Icon: XIcon, href: c["contact.x"], label: "X" },
    { Icon: Youtube, href: c["contact.youtube"], label: "YouTube" },
  ].filter((s) => s.href);
  return (
    <>
      <PageHero eyebrow="Contact" title="Come say hello." subtitle="We'd love to meet your family and show you around our campus in Jos." />
      <section className="container-wide pb-24 grid gap-12 md:grid-cols-2">
        <div className="space-y-8">
          {items.map(({ Icon, label, value }) => (
            <div key={label} className="flex gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-navy-deep">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                <div className="mt-1 font-display text-xl text-foreground whitespace-pre-line">{value}</div>
              </div>
            </div>
          ))}
          {socials.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Follow us</div>
              <div className="mt-3 flex items-center gap-3">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-navy-deep transition-colors hover:bg-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <form
          className="rounded-2xl bg-secondary/60 p-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const body = encodeURIComponent(
              `Name: ${data.get("name")}\nPhone: ${data.get("phone")}\n\n${data.get("message")}`,
            );
            window.location.href = `mailto:${c["contact.email"]}?subject=Website enquiry&body=${body}`;
          }}
        >
          <h2 className="font-display text-2xl">Send us a message</h2>
          <input name="name" required placeholder="Your name" className="w-full rounded-md border border-border bg-background px-4 py-3" />
          <input name="phone" placeholder="Phone (optional)" className="w-full rounded-md border border-border bg-background px-4 py-3" />
          <textarea name="message" required rows={5} placeholder="How can we help?" className="w-full rounded-md border border-border bg-background px-4 py-3" />
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-navy-deep transition-colors">
            Send message
          </button>
        </form>
      </section>
    </>
  );
}