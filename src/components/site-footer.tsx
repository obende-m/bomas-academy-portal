import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, X as XIcon } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import logoAsset from "@/assets/bomas-logo.jpg";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions", label: "Admissions" },
  { to: "/facilities", label: "Facilities" },
  { to: "/gallery", label: "Gallery" },
  { to: "/news", label: "News" },
  { to: "/downloads", label: "Downloads" },
  { to: "/contact", label: "Contact" },
  { to: "/school-life", label: "School Life" },
  { to: "/staff", label: "Staff" },
] as const;

export function SiteFooter() {
  const c = useSiteContent();
  const socials = [
    { Icon: Facebook, href: c["contact.facebook"], label: "Facebook" },
    { Icon: Instagram, href: c["contact.instagram"], label: "Instagram" },
    { Icon: XIcon, href: c["contact.x"], label: "X" },
    { Icon: Youtube, href: c["contact.youtube"], label: "YouTube" },
  ].filter((s) => s.href);
  return (
    <footer className="mt-24 bg-navy-deep text-[oklch(0.96_0.01_80)]">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <img src={logoAsset} alt="" className="h-12 w-12 rounded-full ring-1 ring-white/20 transition-transform group-hover:rotate-[6deg]" />
            <div>
              <div className="font-display text-xl text-white">Bomas Academy</div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">Est. in Jos</div>
            </div>
          </Link>
          <p className="mt-3 text-sm italic text-red-400">…inspiring learning for greatness</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            A nurturing learning community shaping confident, curious and compassionate young
            minds in the heart of Jos, Plateau State.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/70">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}><Link to={link.to} className="hover:text-accent">{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Visit & contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{c["contact.address"]}</li>
            <li>{c["contact.phone"]}</li>
            <li>
              <a href={`mailto:${c["contact.email"]}`} className="hover:text-accent">{c["contact.email"]}</a>
            </li>
            <li className="text-white/50">{c["contact.hours"]}</li>
          </ul>
          {socials.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Bomas Academy. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <Link to="/auth" className="hover:text-accent">Admin</Link>
            <span>Developed by Runa Labs</span>
          </span>
        </div>
      </div>
    </footer>
  );
}