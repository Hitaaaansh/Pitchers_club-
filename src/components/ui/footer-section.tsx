"use client";
import React from "react";
import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface FooterLink {
  title: string;
  href: string;
}

interface SocialLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const exploreLinks: FooterLink[] = [
  { title: "About", href: "/about" },
  { title: "Events", href: "/events" },
  { title: "Team", href: "/team" },
  { title: "Sponsor Us", href: "/sponsor" },
];

const socialLinks: SocialLink[] = [
  { title: "Instagram", href: "https://www.instagram.com/pitchersmuj/", icon: Instagram },
  { title: "LinkedIn", href: "https://www.linkedin.com/company/pitchers-club/", icon: Linkedin },
  {
    title: "WhatsApp",
    href: "https://chat.whatsapp.com/KQjb1khPQbl7ed4104IgUo",
    icon: MessageCircle,
  },
  {
    title: "Email",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=pitchersmuj@gmail.com",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="relative w-full bg-[#0A0A0A] border-t border-[#2A2A2A] px-6 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto grid w-full gap-10 md:grid-cols-3">
        <AnimatedContainer className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">PITCHERS</h2>
          <p className="text-[#A0A0A0] text-sm max-w-xs">
            The entrepreneurship and event management club at Manipal University Jaipur. Turning
            ideas into impact, one pitch at a time.
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={0.1}>
          <h3 className="text-xs uppercase tracking-widest text-[#666666] font-semibold mb-4">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.title}>
                <Link
                  to={link.href}
                  className="text-white/80 hover:text-[#E8A020] transition-colors duration-300"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </AnimatedContainer>

        <AnimatedContainer delay={0.2}>
          <h3 className="text-xs uppercase tracking-widest text-[#666666] font-semibold mb-4">
            Connect
          </h3>
          <div className="flex gap-3 mb-4">
            {socialLinks.map((social) => (
              <a
                key={social.title}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={social.title}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-[#A50000]/20 hover:border-[#A50000]/30 hover:text-[#E8A020] transition-all duration-300"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pitchersmuj@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A0A0A0] text-sm hover:text-[#E8A020] transition-colors duration-300 block"
          >
            pitchersmuj@gmail.com
          </a>
        </AnimatedContainer>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#2A2A2A] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[#666666] text-xs">© 2026 Pitchers Club · Manipal University Jaipur</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            to="/privacy"
            className="text-[#444444] text-xs hover:text-[#666666] transition-colors duration-300"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-[#444444] text-xs hover:text-[#666666] transition-colors duration-300"
          >
            Terms of Service
          </Link>
          <Link
            to="/admin"
            className="text-[#444444] text-xs hover:text-[#666666] transition-colors duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
