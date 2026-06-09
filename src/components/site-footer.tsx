import { Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/use-site-content";
import logoAsset from "@/assets/bomas-logo.jpg";

export function SiteFooter() {
  const c = useSiteContent();
  return (
    <footer className="mt-24 bg-navy-deep text-[oklch(0.96_0.01_80)]">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoAsset} alt="" className="h-12 w-12 rounded-full ring-1 ring-white/20" />
            <div>
              <div className="font-display text-xl text-white">Bomas Academy</div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">Est. in Jos</div>
            </div>
          </div>
          <p className="mt-3 text-sm italic text-red-400">…inspiring learning for greatness</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            A nurturing learning community shaping confident, curious and compassionate young
            minds in the heart of Jos, Plateau State.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/academics" className="hover:text-accent">Academics</Link></li>
            <li><Link to="/admissions" className="hover:text-accent">Admissions</Link></li>
            <li><Link to="/staff" className="hover:text-accent">Staff</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Discover</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/gallery" className="hover:text-accent">Gallery</Link></li>
            <li><Link to="/news" className="hover:text-accent">News</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-accent">Admin sign in</Link></li>
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
            {c["contact.facebook"] && (
              <li>
                <a href={`https://${c["contact.facebook"]}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  Facebook
                </a>
              </li>
            )}
            <li className="text-white/50">{c["contact.hours"]}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Bomas Academy. All rights reserved.</span>
          <span>Built by Runa Labs</span>
        </div>
      </div>
    </footer>
  );
}