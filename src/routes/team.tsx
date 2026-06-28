import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DOMAINS } from "@/lib/mock-data";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db, TeamMember } from "@/lib/db";
import heroBgImg from "@/assets/img/team header img.jpg";
import { motion } from "motion/react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

import parthImg from "@/assets/img/Parth Shukla.jpg";
import priyalImg from "@/assets/img/priyal.jpeg";
import shifaImg from "@/assets/img/Shifa Sheikh.jpeg";
import siyaImg from "@/assets/img/siya.jpeg";
import pariImg from "@/assets/img/Pari Shukla.jpg";
import aryanImg from "@/assets/img/Aryan Kumar.webp";

const memberPhotos: Record<string, string> = {
  parth: parthImg,
  "parth shukla": parthImg,
  "priyal saxena": priyalImg,
  priyal: priyalImg,
  shifa: shifaImg,
  "shifa sheikh": shifaImg,
  "siya punglia": siyaImg,
  siya: siyaImg,
  "pari shukla": pariImg,
  pari: pariImg,
  aryan: aryanImg,
  "aryan kumar": aryanImg,
  ritik: aryanImg,
  "ritik narang": aryanImg,
};

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Pitchers Club" },
      { name: "description", content: "Meet the core team behind Pitchers Club at MUJ." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { data: team = [] } = useQuery({
    queryKey: ["team"],
    queryFn: () => db.getTeam(),
  });

  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? team : team.filter((m) => m.domain === filter);
  const sortedTeam = [...filtered].sort((a, b) => {
    const aIsCoord = a.tier === "Club coordinator" ? 1 : 0;
    const bIsCoord = b.tier === "Club coordinator" ? 1 : 0;
    return bIsCoord - aIsCoord;
  });
  const tabs = ["All", "Leadership", ...DOMAINS.map((d) => d.name)];

  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-28 pb-10 md:h-[460px] md:pt-24 md:pb-0 md:flex md:flex-col md:justify-center border-b border-[#2A2A2A]">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-[length:140%_auto] sm:bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url(${heroBgImg})` }}
          />
          {/* Subtle horizontal gradient overlay to make text highly readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/75 via-[#0F0F0F]/20 to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-5 z-10 w-full">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">Team</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-white leading-[1.15] font-display tracking-tight [word-spacing:0.12em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              The people <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A020] to-[#f5c76c]">
                behind the pitchers
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-[#A0A0A0] font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              The builders, creators, and leaders orchestrating the entrepreneurship ecosystem at
              MUJ.
            </p>
          </div>
        </section>

        {/* TEAM CONTENT */}
        <section className="section-pad bg-[#0F0F0F]">
          <div className="mx-auto max-w-7xl px-5">
            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-1 sm:gap-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`rounded-full px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                    filter === t
                      ? "bg-crimson text-white shadow-[0_0_20px_-3px_rgba(165,0,0,0.5)]"
                      : "border border-[#2A2A2A] bg-[#1A1A1A] text-[#A0A0A0] hover:border-crimson hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid gap-2 sm:gap-6 grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
              {sortedTeam.map((m) => (
                <TeamMemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isHover, setIsHover] = useState(false);

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  const photo = member.photoUrl || memberPhotos[member.name.toLowerCase().trim()];

  const tier = member.tier || "Core team";
  let glowClasses = "";
  if (tier === "Club coordinator" || tier === "Executive") {
    glowClasses = "hover:border-[#E8A020]/60 hover:shadow-[0_0_40px_rgba(232,160,32,0.65)]";
  } else if (tier === "Core team" || tier === "Working team") {
    glowClasses = "hover:border-crimson/60 hover:shadow-[0_0_40px_rgba(165,0,0,0.65)]";
  } else {
    glowClasses = "hover:border-white/20 hover:shadow-none";
  }

  return (
    <article
      className={`relative aspect-[3/4] w-full max-w-[120px] sm:max-w-[320px] overflow-hidden rounded-xl sm:rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] transition-all duration-300 cursor-default select-none ${glowClasses}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Background (photo or initials gradient) */}
      {photo ? (
        <img
          src={photo}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out pointer-events-none"
          style={{ transform: isHover ? "scale(1.05)" : "scale(1)" }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-2xl sm:text-6xl font-bold font-display text-white/10 transition-transform duration-500 ease-in-out"
          style={{
            background: "linear-gradient(135deg, #3A0505, #0A0A0A)",
            transform: isHover ? "scale(1.05)" : "scale(1)",
          }}
        >
          {initials}
        </div>
      )}

      {/* Blur overlay */}
      <ProgressiveBlur
        className="pointer-events-none absolute bottom-0 left-0 h-[60%] w-full"
        blurLayers={6}
        blurIntensity={1.0}
        animate={isHover ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Backing dark solid transition overlay for text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/60 to-transparent transition-opacity duration-300 pointer-events-none"
        style={{ opacity: isHover ? 0.95 : 0.8 }}
      />

      {/* Text content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-5 z-10 pointer-events-none">
        <motion.div layout transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-1 sm:space-y-1.5">
          <h3 className="text-[11px] sm:text-xl font-bold text-white uppercase font-display leading-tight">
            {member.name}
          </h3>
          <p className="text-[9px] sm:text-xs font-semibold text-crimson uppercase tracking-wider leading-tight">
            {member.role}
          </p>
          <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[#666666] leading-tight">
            {tier === "Club coordinator" ? member.domain : `${member.domain} · ${member.year}`}
          </p>

          {/* Expand Bio on hover */}
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={
              isHover
                ? { height: "auto", opacity: 1, marginTop: 8 }
                : { height: 0, opacity: 0, marginTop: 0 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden hidden sm:block"
          >
            <p className="text-xs text-[#A0A0A0] leading-relaxed font-light font-sans">
              {member.bio}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </article>
  );
}
