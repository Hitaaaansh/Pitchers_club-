import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Instagram, Linkedin, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import WarpShaderHero from "@/components/ui/wrap-shader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Pitchers Club" },
      {
        name: "description",
        content: "Get in touch with Pitchers Club at Manipal University Jaipur.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Fill all fields.");
      return;
    }

    try {
      await db.addContactSubmission({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      toast.success("Message sent. We'll reply within 28 hours.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message.");
    }
  }
  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-36 pb-20 md:pt-44 md:pb-24 border-b border-[#2A2A2A]">
          {/* Subtle dark marbled texture background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <WarpShaderHero />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">Contact</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-white leading-[1.15] font-display tracking-tight [word-spacing:0.12em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Let's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A020] to-[#f5c76c]">
                talk
              </span>
            </h1>
          </div>
        </section>

        {/* CONTENT */}
        <section className="section-pad bg-[#0F0F0F]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
            <form
              onSubmit={submit}
              className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-8 shadow-card"
            >
              <h2 className="text-3xl font-bold text-white uppercase font-display mb-6">
                Send a message
              </h2>
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                    Name <span className="text-crimson font-normal">*</span>
                  </span>
                  <input
                    className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                    Email <span className="text-crimson font-normal">*</span>
                  </span>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                    Message <span className="text-crimson font-normal">*</span>
                  </span>
                  <textarea
                    rows={5}
                    className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </label>
                <button className="rounded-full bg-crimson px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_-3px_rgba(165,0,0,0.5)] hover:opacity-95 cursor-pointer">
                  Send
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <Info
                icon={<Mail />}
                title="Email"
                value="pitchersmuj@gmail.com"
                href="mailto:pitchersmuj@gmail.com"
              />
              <Info
                icon={<MapPin />}
                title="Find us"
                value="Manipal University Jaipur, Dehmi Kalan, Rajasthan 303007"
              />
              <Info
                icon={<Instagram />}
                title="Instagram"
                value="@pitchersmuj"
                href="https://www.instagram.com/pitchersmuj/"
              />
              <Info
                icon={<Linkedin />}
                title="LinkedIn"
                value="@pitchersmuj"
                href="https://www.linkedin.com/company/pitchers-club/"
              />
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}

function Info({ icon, title, value, href }: InfoProps) {
  const content = (
    <>
      <div className="rounded-xl bg-crimson/10 border border-crimson/20 p-3 text-crimson transition-colors group-hover:bg-crimson/20">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#666666]">{title}</p>
        <p className="mt-1 font-medium text-white transition-colors group-hover:text-[#E8A020]">
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noreferrer"
        className="group flex items-start gap-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 hover:border-[#A50000]/20 hover:bg-[#222222] transition-all duration-300 cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 hover:border-[#A50000]/20 transition-all duration-300">
      {content}
    </div>
  );
}
