import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { DOMAINS } from "@/lib/mock-data";
import { db } from "@/lib/db";
import heroBgImg from "@/assets/img/Untitled design.png";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Us — Pitchers Club" },
      {
        name: "description",
        content: "Apply to join Pitchers Club at MUJ. Open across all five domains.",
      },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const { data: recruitmentOpen = true } = useQuery({
    queryKey: ["recruitmentOpen"],
    queryFn: () => db.getRecruitmentOpen(),
  });

  const [form, setForm] = useState({
    name: "",
    regNumber: "",
    email: "",
    mobileNumber: "",
    year: "",
    domain: DOMAINS[0].name,
    why: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.regNumber ||
      !form.mobileNumber ||
      !form.year ||
      !form.domain
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await db.addJoinSubmission({
        name: form.name,
        regNumber: form.regNumber,
        email: form.email,
        mobile: form.mobileNumber,
        year: form.year,
        domain: form.domain,
        why: form.why,
      });
      toast.success("Application received. We'll be in touch via email.");
      setForm({
        name: "",
        regNumber: "",
        email: "",
        mobileNumber: "",
        year: "",
        domain: DOMAINS[0].name,
        why: "",
      });
    } catch (err) {
      toast.error("Failed to submit application.");
    }
  }

  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-36 pb-20 md:pt-44 md:pb-24 border-b border-[#2A2A2A]">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80 brightness-125 pointer-events-none"
            style={{ backgroundImage: `url(${heroBgImg})` }}
          />
          {/* Dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/30 via-[#0F0F0F]/20 to-[#0F0F0F]/25 pointer-events-none" />
          {/* Horizontal left-to-right dark gradient overlay behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/85 via-[#0F0F0F]/40 to-transparent pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-5 z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">Join</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-white leading-[1.15] font-display tracking-tight [word-spacing:0.12em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Take a seat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A020] to-[#f5c76c]">
                at the table
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-[#A0A0A0] font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              We recruit across all five domains every academic year. No prior experience required —
              just bring ideas, time, and the willingness to ship.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="section-pad bg-[#0F0F0F]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.4fr_1fr]">
            {/* Form Card */}
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-8 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white uppercase font-display">
                  Membership form
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    recruitmentOpen
                      ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                      : "bg-[#2A2A2A] text-[#666666]"
                  }`}
                >
                  {recruitmentOpen ? "Open" : "Closed"}
                </span>
              </div>

              {recruitmentOpen && (
                <div className="mb-6 rounded-xl border border-[#A50000]/20 bg-[#A50000]/5 p-4 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                  <p className="font-bold text-white uppercase tracking-widest mb-2 text-[10px]">
                    Instructions
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>Make sure you're part of MUJ campus.</li>
                    <li>After submitting the form, we'd reply within 48 hours.</li>
                  </ul>
                </div>
              )}

              {!recruitmentOpen ? (
                <p className="text-[#666666] font-light">
                  Recruitment is currently closed. Follow our Instagram for the next cycle.
                </p>
              ) : (
                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                  />
                  <Field
                    label="Registration number"
                    value={form.regNumber}
                    onChange={(v) => setForm({ ...form, regNumber: v })}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                  <Field
                    label="Mobile number"
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(v) => setForm({ ...form, mobileNumber: v })}
                  />
                  <Field
                    label="Year of study"
                    value={form.year}
                    onChange={(v) => setForm({ ...form, year: v })}
                  />
                  <label className="block relative">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                      Preferred domain <span className="text-crimson font-normal">*</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300 text-left cursor-pointer"
                    >
                      <span>{form.domain}</span>
                      <span
                        className="text-[#666666] text-xs transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-1 shadow-2xl z-20">
                          {[...DOMAINS.map((d) => d.name), "Member"].map((opt) => (
                            <li key={opt}>
                              <button
                                type="button"
                                onClick={() => {
                                  setForm({ ...form, domain: opt });
                                  setIsOpen(false);
                                }}
                                className="w-full text-left rounded-md px-3 py-2 text-sm text-white hover:text-[#E8A020] hover:bg-[#E8A020]/10 transition-colors duration-200 cursor-pointer"
                              >
                                {opt}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </label>
                  <label className="sm:col-span-2 block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                      Why Pitchers?{" "}
                      <span className="text-[10px] lowercase text-[#666666] font-light italic">
                        (optional)
                      </span>
                    </span>
                    <textarea
                      rows={4}
                      value={form.why}
                      onChange={(e) => setForm({ ...form, why: e.target.value })}
                      className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300"
                    />
                  </label>
                  <button className="sm:col-span-2 rounded-full bg-crimson px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_-3px_rgba(165,0,0,0.5)] hover:opacity-95 cursor-pointer">
                    Submit application
                  </button>
                </form>
              )}
            </div>

            {/* Side Column */}
            <aside className="space-y-6">
              {/* WhatsApp Card */}
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-crimson/10 border border-crimson/20 p-3 text-crimson">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase font-display">
                    Join the community
                  </h3>
                </div>
                <p className="mt-3 text-sm text-[#A0A0A0] leading-relaxed font-light">
                  Hop into our WhatsApp community for event updates and informal Q&A — open to all
                  MUJ students.
                </p>
                <a
                  href="https://chat.whatsapp.com/KQjb1khPQbl7ed4104IgUo"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block rounded-full border border-crimson px-5 py-2 text-sm font-semibold text-crimson transition-all duration-300 hover:bg-crimson hover:text-white"
                >
                  Join WhatsApp
                </a>
              </div>

              {/* What We Look For Card */}
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 text-[#A0A0A0]">
                <h3 className="text-xl font-bold text-white uppercase font-display">
                  What we look for
                </h3>
                <ul className="mt-4 space-y-3 text-sm font-light leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[#E8A020] font-bold">·</span>
                    <span>Curiosity beats credentials.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#E8A020] font-bold">·</span>
                    <span>Ship things, not just plan them.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#E8A020] font-bold">·</span>
                    <span>Be kind, be reliable, be on time.</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

function Field({ label, value, onChange, type = "text" }: FieldProps) {
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
