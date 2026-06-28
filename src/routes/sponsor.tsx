import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import WarpShaderHero from "@/components/ui/wrap-shader";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import logo1 from "@/assets/sponsors/1.png";
import logo2 from "@/assets/sponsors/2.png";
import logo3 from "@/assets/sponsors/3.png";
import logo4 from "@/assets/sponsors/4.png";
import logo5 from "@/assets/sponsors/5.png";
import logo6 from "@/assets/sponsors/6.png";
import logo7 from "@/assets/sponsors/7.png";
import logoSponsor1 from "@/assets/sponsors/sponosor 1.png";

export const Route = createFileRoute("/sponsor")({
  head: () => ({
    meta: [
      { title: "Sponsor Us — Pitchers Club" },
      {
        name: "description",
        content:
          "Partner with Pitchers Club at MUJ. Reach 5,000+ engaged students across India's top private campus.",
      },
    ],
  }),
  component: SponsorPage,
});

function SponsorPage() {
  const [form, setForm] = useState({
    org: "",
    contact: "",
    email: "",
    phone: "",
    interest: "Cash Sponsorship",
    budget: "Flexible",
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.org || !form.contact || !form.email || !form.phone || !form.message) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await db.addSponsorInquiry({
        org: form.org,
        contact: form.contact,
        email: form.email,
        phone: form.phone,
        message: `[Interest: ${form.interest} | Budget: ${form.budget}] ${form.message}`,
      });
      toast.success("Inquiry sent. We'll respond within 28 hours.");
      setForm({
        org: "",
        contact: "",
        email: "",
        phone: "",
        interest: "Cash Sponsorship",
        budget: "Flexible",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to submit inquiry.");
    }
  }

  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-36 pb-12 md:pt-44 md:pb-16 border-b border-[#2A2A2A]">
          {/* Subtle dark marbled texture background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <WarpShaderHero />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">Sponsor</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-white leading-[1.15] font-display tracking-tight [word-spacing:0.12em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Reach the founders <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A020] to-[#f5c76c]">
                of tomorrow
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-[#A0A0A0] font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              We host MUJ's largest entrepreneurship events — putting your brand in front of 5,000+
              students, faculty, and alumni who are actively building, hiring, and buying.
            </p>
          </div>
        </section>

        {/* LOGO MARQUEE */}
        <LogoMarquee
          logos={[
            { src: logo1, alt: "Sponsor 1", className: "scale-[1.3] origin-center" },
            { src: logo2, alt: "Sponsor 2" },
            { src: logo3, alt: "Sponsor 3" },
            { src: logo4, alt: "Sponsor 4", className: "scale-[1.3] origin-center" },
            { src: logo5, alt: "Sponsor 5" },
            { src: logo6, alt: "Sponsor 6", className: "scale-[1.3] origin-center" },
            { src: logo7, alt: "Sponsor 7" },
            { src: logoSponsor1, alt: "Sponsor 8" },
          ]}
        />

        {/* STATS STRIP */}
        <section className="py-10 bg-transparent border-b border-[#2A2A2A]">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-0">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-crimson">
                  <AnimatedCounter end={5000} suffix="+" />
                </div>
                <div className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Students Reached
                </div>
              </div>

              <div className="hidden lg:block w-px h-12 bg-[#2A2A2A]" />

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                  <AnimatedCounter end={20} suffix="+" />
                </div>
                <div className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Events Delivered
                </div>
              </div>

              <div className="hidden lg:block w-px h-12 bg-[#2A2A2A]" />

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-crimson">
                  <AnimatedCounter end={8} suffix="+" />
                </div>
                <div className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Brand Partnerships
                </div>
              </div>

              <div className="hidden lg:block w-px h-12 bg-[#2A2A2A]" />

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                  <AnimatedCounter end={3} suffix="+" />
                </div>
                <div className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Years on Campus
                </div>
              </div>

              <div className="hidden lg:block w-px h-12 bg-[#2A2A2A]" />

              {/* Stat 5 */}
              <div className="col-span-2 md:col-span-1 flex flex-col items-center text-center px-4">
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-crimson">
                  <AnimatedCounter end={50} suffix="K+" />
                </div>
                <div className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Monthly Social Media Views
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INQUIRY FORM */}
        <section className="py-12 bg-[#0F0F0F]">
          <div className="mx-auto max-w-3xl px-5">
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="inline-flex flex-col items-start text-left">
                <p className="logo-script text-[#E8A020] text-3xl font-normal lowercase tracking-normal">
                  get in touch
                </p>
                <h2 className="relative mt-1 text-3xl sm:text-4xl uppercase tracking-tight text-white pb-2 group/sponsor inline-block cursor-default font-display">
                  Sponsorship inquiry
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-crimson transition-all duration-300 ease-out group-hover/sponsor:w-full" />
                </h2>
              </div>
            </div>
            <form
              onSubmit={submit}
              className="grid gap-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-8 shadow-card sm:grid-cols-2"
            >
              <F
                label="Organization"
                value={form.org}
                onChange={(v) => setForm({ ...form, org: v })}
              />
              <F
                label="Contact person"
                value={form.contact}
                onChange={(v) => setForm({ ...form, contact: v })}
              />
              <F
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
              <F
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Sponsorship Interest <span className="text-crimson font-normal">*</span>
                </span>
                <select
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
                >
                  <option value="Cash Sponsorship" className="bg-[#1A1A1A] text-white">
                    Cash Sponsorship
                  </option>
                  <option value="Product Sponsorship" className="bg-[#1A1A1A] text-white">
                    Product Sponsorship
                  </option>
                  <option value="Media Partnership" className="bg-[#1A1A1A] text-white">
                    Media Partnership
                  </option>
                  <option value="Venue Partnership" className="bg-[#1A1A1A] text-white">
                    Venue Partnership
                  </option>
                  <option value="Other" className="bg-[#1A1A1A] text-white">
                    Other
                  </option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Budget Range <span className="text-crimson font-normal">*</span>
                </span>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
                >
                  <option value="Under ₹25k" className="bg-[#1A1A1A] text-white">
                    Under ₹25k
                  </option>
                  <option value="₹25k–₹75k" className="bg-[#1A1A1A] text-white">
                    ₹25k–₹75k
                  </option>
                  <option value="₹75k+" className="bg-[#1A1A1A] text-white">
                    ₹75k+
                  </option>
                  <option value="Flexible" className="bg-[#1A1A1A] text-white">
                    Flexible
                  </option>
                  <option value="Prefer to discuss" className="bg-[#1A1A1A] text-white">
                    Prefer to discuss
                  </option>
                </select>
              </label>
              <label className="sm:col-span-2 block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                  Message <span className="text-crimson font-normal">*</span>
                </span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
                  required
                />
              </label>
              <button className="sm:col-span-2 rounded-full bg-crimson px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_-3px_rgba(165,0,0,0.5)] hover:opacity-95 cursor-pointer">
                Send inquiry
              </button>
            </form>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

interface FProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

function F({ label, value, onChange, type = "text" }: FProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
        {label} <span className="text-crimson font-normal">*</span>
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
        required
      />
    </label>
  );
}
