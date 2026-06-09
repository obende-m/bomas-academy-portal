import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/bomas-logo.jpg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions", label: "Admissions" },
  { to: "/staff", label: "Staff" },
  { to: "/gallery", label: "Gallery" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-background ${
        scrolled ? "shadow-[0_1px_0_0_var(--border)]" : ""
      }`}
    >
      <div className="container-wide flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoAsset}
            alt="Bomas Academy"
            className="h-12 w-12 rounded-full ring-1 ring-border transition-transform group-hover:rotate-[6deg]"
          />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-foreground">Bomas Academy</div>
            <div className="text-[10px] italic text-red-500">…inspiring learning for greatness</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/admissions"
          className="hidden lg:inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-navy-deep hover:shadow-lg hover:shadow-primary/20"
        >
          Apply now
        </Link>

        <button
          className="lg:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container-wide flex flex-col py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-3 text-base font-medium text-foreground border-b border-border/60 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admissions"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Apply now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}