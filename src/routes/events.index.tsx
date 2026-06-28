import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { EventCard } from "@/components/ui/event-card";
import { EventItem } from "@/lib/mock-data";
import blackoutImg from "@/assets/PROJECT BLACKOUT.png";
import pitchImg from "@/assets/WhatsApp Image 2025-10-16 at 10.21.56_53d56303.jpg";
import strtup from "@/assets/img/EMAIL POSTER.png";
import seminar from "@/assets/img/Busines.png";
import heroBgImg from "@/assets/img/events header img.png";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events — Pitchers Club" },
      { name: "description", content: "Upcoming and past events hosted by Pitchers Club at MUJ." },
    ],
  }),
  component: EventsIndex,
});

function EventsIndex() {
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => db.getEvents(),
  });

  // Upcoming events sorted chronologically (soonest first)
  const upcoming = [...events]
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Past events sorted reverse-chronologically (latest first)
  const past = [...events]
    .filter((e) => e.status === "past")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const getEventImage = (e: EventItem) => {
    if (e.cover && !e.cover.startsWith("linear-gradient")) {
      return e.cover;
    }
    const normalize = (str: string) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchedKey = Object.keys(eventImages).find((key) => {
      const normKey = normalize(key);
      const normTitle = normalize(e.title);
      const normId = normalize(e.id);
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
    if (e.cover && e.cover.startsWith("linear-gradient")) {
      return e.cover;
    }
    return defaultEventImage;
  };

  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-36 pb-20 md:h-[460px] md:pt-24 md:pb-0 md:flex md:flex-col md:justify-center border-b border-[#2A2A2A]">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80 brightness-125 pointer-events-none"
            style={{ backgroundImage: `url(${heroBgImg})` }}
          />
          {/* Dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/30 via-[#0F0F0F]/20 to-[#0F0F0F]/25 pointer-events-none" />
          {/* Horizontal left-to-right dark gradient overlay behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/85 via-[#0F0F0F]/40 to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-5 z-10 w-full">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">Events</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-white leading-[1.15] font-display tracking-tight [word-spacing:0.12em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              From{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A020] to-[#f5c76c]">
                ideathons
              </span>{" "}
              <br />
              to flagship events
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-[#A0A0A0] font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Ideathons to flagship events — this is where Pitchers members go from learning to
              leading
            </p>
          </div>
        </section>

        {/* EVENTS LIST */}
        <section className="section-pad bg-[#0F0F0F] pb-10">
          <div className="mx-auto max-w-7xl px-5">
            {/* UPCOMING */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="inline-flex flex-col items-start text-left">
                <p className="logo-script text-[#E8A020] text-3xl font-normal lowercase tracking-normal">
                  what's next
                </p>
                <h2 className="relative mt-1 text-3xl sm:text-4xl uppercase tracking-tight text-white pb-2 group/heading inline-block cursor-default font-display">
                  Upcoming
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-crimson transition-all duration-300 ease-out group-hover/heading:w-full" />
                </h2>
              </div>
            </div>
            {upcoming.length === 0 ? (
              <div className="w-full max-w-xl mx-auto rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm animate-fade-in shadow-soft mt-6 mb-16">
                <p className="text-base font-semibold text-white font-display uppercase tracking-widest">
                  No upcoming event
                </p>
                <p className="mt-2 text-xs text-[#A0A0A0] font-light tracking-wide">
                  We're working on it! Follow our announcements and join us for the next big
                  journey.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-2 sm:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 justify-items-center mb-16">
                {upcoming.map((e) => (
                  <div key={e.id} className="w-full max-w-[160px] sm:max-w-[320px] h-[260px] sm:h-[450px]">
                    <EventCard
                      imageUrl={getEventImage(e)}
                      title={e.title}
                      date={new Date(e.date).toDateString()}
                      description={e.description}
                      href={`/events/${slugify(e.title)}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* PAST EVENTS */}
            <div className="mt-16 mb-8 flex flex-col items-center text-center">
              <div className="inline-flex flex-col items-start text-left">
                <p className="logo-script text-[#E8A020] text-3xl font-normal lowercase tracking-normal">
                  history
                </p>
                <h2 className="relative mt-1 text-3xl sm:text-4xl uppercase tracking-tight text-white pb-2 group/past inline-block cursor-default font-display">
                  Past events
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-crimson transition-all duration-300 ease-out group-hover/past:w-full" />
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-2 sm:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {past.map((e) => (
                <div key={e.id} className="w-full max-w-[160px] sm:max-w-[320px] h-[260px] sm:h-[450px]">
                  <EventCard
                    imageUrl={getEventImage(e)}
                    title={e.title}
                    date={new Date(e.date).toDateString()}
                    description={e.description}
                    href={`/events/${slugify(e.title)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
