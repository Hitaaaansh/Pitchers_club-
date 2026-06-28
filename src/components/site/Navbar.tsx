import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/img/website logo-Photoroom.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/join", label: "Join Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      // Show navbar if scrolling up, or near top, or if mobile menu is open
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10 || open;

      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, open]);

  const path = useRouterState({ select: (s) => s.location.pathname });
  const isHeroPage =
    path === "/" ||
    path === "/about" ||
    path === "/events" ||
    path === "/events/" ||
    path === "/team" ||
    path === "/join" ||
    path === "/sponsor" ||
    path === "/contact" ||
    path.startsWith("/events/");

  const useWhiteNavbar = true;

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-7xl transition-all duration-300 border shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)] ${
        visible ? "top-4 opacity-100" : "-top-20 opacity-0 pointer-events-none"
      } ${
        open ? "rounded-[24px]" : "rounded-full"
      } ${
        useWhiteNavbar
          ? "bg-charcoal/70 border-white/10 text-cream backdrop-blur-md"
          : "bg-cream/75 border-border/80 text-foreground backdrop-blur-lg"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-6 md:px-8">
        <Link to="/" className="group relative flex items-center gap-3">
          {logoFailed ? (
            <span
              className={`font-display text-2xl tracking-tighter transition-colors duration-300 ${
                useWhiteNavbar
                  ? "text-cream hover:text-crimson"
                  : "text-charcoal hover:text-crimson"
              }`}
            >
              PITCHERS
            </span>
          ) : (
            <img
              src={logoImg}
              alt="Pitchers Club"
              className={`h-12 w-auto object-contain ${
                useWhiteNavbar ? "hover:filter-logo-crimson" : "filter-logo-crimson"
              }`}
              onError={() => setLogoFailed(true)}
            />
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className={`text-sm font-medium transition-colors ${
                useWhiteNavbar
                  ? "text-cream/80 hover:text-accent"
                  : "text-foreground/80 hover:text-crimson"
              }`}
              activeProps={{ className: useWhiteNavbar ? "text-accent" : "text-crimson" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/sponsor"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card transition-transform hover:-translate-y-0.5"
          >
            Sponsor Us
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          className={`md:hidden p-1 rounded-full hover:bg-black/10 transition-colors ${useWhiteNavbar ? "text-cream" : "text-foreground"}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div
          className={`border-t md:hidden ${
            useWhiteNavbar
              ? "bg-charcoal/95 border-white/10 text-cream"
              : "bg-background/95 border-border text-foreground"
          } rounded-b-[24px] overflow-hidden`}
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  useWhiteNavbar ? "hover:bg-white/10" : "hover:bg-secondary"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/sponsor"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground"
            >
              Sponsor Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
