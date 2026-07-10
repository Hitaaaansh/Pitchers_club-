import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DOMAINS } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";
import WarpShaderHero from "@/components/ui/wrap-shader";
import GlassStatsCard from "@/components/ui/glass-stats-card";
import { EventCard } from "@/components/ui/event-card";
import DomainExpandingCards from "@/components/ui/domain-expanding-cards";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import blackoutImg from "@/assets/PROJECT BLACKOUT.png";
import pitchImg from "@/assets/WhatsApp Image 2025-10-16 at 10.21.56_53d56303.jpg";
import strtup from "@/assets/img/EMAIL POSTER.png";
import seminar from "@/assets/img/Busines.png";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pitchers Club — MUJ" },
      {
        name: "description",
        content:
          "Turning ideas into impact. The entrepreneurship and event management club at Manipal University Jaipur.",
      },
    ],
  }),
  loader: async ({ context }) => {
    const { queryClient } = context;
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["events"],
        queryFn: () => db.getEvents(),
      }),
      queryClient.ensureQueryData({
        queryKey: ["announcements"],
        queryFn: () => db.getAnnouncements(),
      }),
      queryClient.ensureQueryData({
        queryKey: ["team"],
        queryFn: () => db.getTeam(),
      }),
    ]);
  },
  component: Home,
});

function renderTypedText(
  text: string,
  startIndex: number,
  typingCount: number,
  totalLength: number,
  isDone: boolean,
  className: string = ""
) {
  return (
    <span className={className}>
      {text.split("").map((char, index) => {
        const globalIndex = startIndex + index;
        const isVisible = globalIndex < typingCount;
        const isLastTyped = globalIndex === typingCount - 1;

        return (
          <span key={index} className="relative">
            <span style={{ visibility: isVisible ? "visible" : "hidden" }}>
              {char}
            </span>
            {isLastTyped && !isDone && (
              <span className="absolute left-[100%] top-[0.15em] ml-0.5 w-[3px] h-[0.75em] bg-accent align-middle animate-pulse" />
            )}
          </span>
        );
      })}
    </span>
  );
}

function TypewriterHeading() {
  const part1 = "Turning ideas";
  const part2 = "into ";
  const part3 = "impact";
  const totalLength = part1.length + part2.length + part3.length;
  const [typingCount, setTypingCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTypingCount((prev) => {
        if (prev >= totalLength) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [totalLength]);

  const isDone = typingCount >= totalLength;

  return (
    <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.1] text-cream [word-spacing:0.12em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {renderTypedText(part1, 0, typingCount, totalLength, isDone)}
      <br />
      {renderTypedText(part2, part1.length, typingCount, totalLength, isDone)}
      {renderTypedText(
        part3,
        part1.length + part2.length,
        typingCount,
        totalLength,
        isDone,
        "text-accent"
      )}
      {isDone && (
        <span className="inline-block ml-1.5 w-[3px] h-[0.75em] bg-accent align-middle animate-pulse" />
      )}
    </h1>
  );
}

function Home() {
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => db.getEvents(),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => db.getAnnouncements(),
  });

  const { data: team = [] } = useQuery({
    queryKey: ["team"],
    queryFn: () => db.getTeam(),
  });

  const upcoming = [...events]
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-charcoal text-cream min-h-[80vh] lg:h-screen flex items-center pt-20 md:pt-28 pb-10 md:pb-16">
        <WarpShaderHero />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 20% 30%, rgba(30,30,30,0.55), transparent 70%), linear-gradient(180deg, rgba(30,30,30,0.35), rgba(30,30,30,0.75))",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-up">
            <span className="text-xs sm:text-sm text-white/60 uppercase tracking-widest mb-2">
              MANIPAL UNIVERSITY JAIPUR
            </span>
            <TypewriterHeading />

            <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-cream/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              From wild events to real startups, Pitchers has a place for you.
              Freshers to founders, everyone is welcome here.
            </p>

            <div className="mt-6 flex flex-nowrap justify-center lg:justify-start gap-2 sm:gap-3">
              <Link
                to="/join"
                className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-crimson px-3 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-sm font-semibold text-cream shadow-card transition-transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Join the club
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-cream/40 bg-cream/5 px-3 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-sm font-semibold text-cream backdrop-blur hover:bg-cream/15 whitespace-nowrap"
              >
                See upcoming events
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <GlassStatsCard />
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="relative overflow-hidden section-pad bg-[#151515] border-b border-white/5">
        {/* Spotlights */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-crimson/12 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5 z-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8A020]">
                Latest
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl text-white">Announcements</h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 self-start sm:self-auto"
            >
              View events →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {announcements.map((a, idx) => (
              <ScrollReveal key={a.id} delay={idx * 150}>
                <article className="rounded-2xl border border-white/10 border-l-4 border-l-crimson bg-[rgba(20,20,20,0.6)] backdrop-blur-md p-4 sm:p-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(165,0,0,0.3)]">
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-gold/90">
                      {new Date(a.date).toDateString()}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl text-white font-bold leading-tight">{a.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">{a.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="relative overflow-hidden section-pad bg-[#151515] border-b border-white/5">
        {/* Spotlights */}
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-crimson/8 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5 z-10">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="inline-flex flex-col items-start text-left">
              <p className="logo-script text-[#E8A020] text-3xl font-normal lowercase tracking-normal">
                what's next
              </p>
              <h2 className="relative mt-1 text-4xl sm:text-5xl uppercase tracking-tight text-white pb-2 group/heading inline-block cursor-default">
                Upcoming events
                <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-crimson transition-all duration-300 ease-out group-hover/heading:w-full" />
              </h2>
            </div>
          </div>
          {upcoming.length === 0 ? (
            <div className="w-full max-w-xl mx-auto rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm animate-fade-in shadow-soft">
              <p className="text-base font-semibold text-white font-display uppercase tracking-widest">
                No upcoming events
              </p>
              <p className="mt-2 text-xs text-[#A0A0A0] font-light tracking-wide">
                We're working on it! Check back soon for our next flagship events, ideathons, and
                networking sessions.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {upcoming.map((e, idx) => {
                const eventImages: Record<string, string> = {
                  "Bayaan-2025": pitchImg,
                  Bayaan: pitchImg,
                  "Project Blackout 2026": blackoutImg,
                  "Project Blackout": blackoutImg,
                  "Startup-Forge 2026": strtup,
                  "Startup-Forge": strtup,
                  "Startup Forge 2026": strtup,
                  "Startup Forge": strtup,
                  "Startup with a soul": seminar,
                  "Startup with soul": seminar,
                  "Startup witha a soul": seminar,
                  "Startup witha soul": seminar,
                  "founders-pitch-2026": pitchImg,
                  "ideathon-spring": blackoutImg,
                };
                const defaultEventImage =
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";

                const slugify = (text: string) =>
                  text
                    .toString()
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w\-]+/g, "")
                    .replace(/\-\-+/g, "-")
                    .replace(/^-+/, "")
                    .replace(/-+$/, "");

                const getEventImage = (item: { id: string; title: string; cover?: string }) => {
                  if (item.cover && !item.cover.startsWith("linear-gradient")) {
                    return item.cover;
                  }
                  const normalize = (str: string) =>
                    (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                  const matchedKey = Object.keys(eventImages).find((key) => {
                    const normKey = normalize(key);
                    const normTitle = normalize(item.title);
                    const normId = normalize(item.id);
                    return (
                      normTitle.includes(normKey) ||
                      normKey.includes(normTitle) ||
                      normId.includes(normKey) ||
                      normKey.includes(normId)
                    );
                  });
                  if (matchedKey) {
                    return eventImages[matchedKey];
                  }
                  if (item.cover && item.cover.startsWith("linear-gradient")) {
                    return item.cover;
                  }
                  return defaultEventImage;
                };

                return (
                  <ScrollReveal key={e.id} delay={idx * 150} className="w-full max-w-[160px] sm:max-w-[320px]">
                    <div className="h-[260px] sm:h-[430px] w-full">
                      <EventCard
                        imageUrl={getEventImage(e)}
                        title={e.title}
                        date={new Date(e.date).toDateString()}
                        description={e.description}
                        href={`/events/${slugify(e.title)}`}
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* DOMAINS */}
      <DomainExpandingCards />
    </SiteLayout>
  );
}
