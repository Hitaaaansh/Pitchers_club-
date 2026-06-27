import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";
import whiteLogo from "@/assets/pitchers-white.png.asset.json";
import { useState } from "react";

export function Footer() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          {logoFailed ? (
            <span className="font-display text-3xl font-black text-cream tracking-tight hover:text-accent transition-colors">
              PITCHERS
            </span>
          ) : (
            <img
              src={whiteLogo.url}
              alt="Pitchers Club"
              className="h-14 w-auto"
              onError={() => setLogoFailed(true)}
            />
          )}
          <p className="mt-3 max-w-md text-sm text-cream/70">
            The entrepreneurship and event management club at Manipal University Jaipur. Turning
            ideas into impact, one pitch at a time.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cream/60">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-accent">
                About
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-accent">
                Events
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-accent">
                Team
              </Link>
            </li>
            <li>
              <Link to="/sponsor" className="hover:text-accent">
                Sponsor Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cream/60">
            Connect
          </h4>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/pitchersmuj/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-cream/10 p-2 hover:bg-accent hover:text-charcoal"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/pitchers-club/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full bg-cream/10 p-2 hover:bg-accent hover:text-charcoal"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://chat.whatsapp.com/KQjb1khPQbl7ed4104IgUo"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="rounded-full bg-cream/10 p-2 hover:bg-accent hover:text-charcoal"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href="mailto:pitchersmuj@gmail.com"
              aria-label="Email"
              className="rounded-full bg-cream/10 p-2 hover:bg-accent hover:text-charcoal"
            >
              <Mail size={18} />
            </a>
          </div>
          <p className="mt-4 text-xs text-cream/60">pitchersmuj@gmail.com</p>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Pitchers Club · Manipal University Jaipur</p>
          <Link to="/admin" className="text-cream/30 hover:text-cream/70">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
