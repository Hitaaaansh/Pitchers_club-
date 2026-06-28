import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import WarpShaderHero from "@/components/ui/wrap-shader";
import { Rocket, Users, Award, Handshake } from "lucide-react";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-pattern";
import heroBgImg from "@/assets/img/about header image.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Pitchers Club" },
      {
        name: "description",
        content:
          "Founded in 2023, Pitchers is the hands-on entrepreneurship and event management club at MUJ.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-28 pb-12 md:pt-48 md:pb-32 border-b border-[#2A2A2A]">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-[length:140%_auto] sm:bg-cover bg-[position:30%_center] bg-no-repeat opacity-80 brightness-125 pointer-events-none"
            style={{ backgroundImage: `url(${heroBgImg})` }}
          />
          {/* Dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/30 via-[#0F0F0F]/20 to-[#0F0F0F]/25 pointer-events-none" />
          {/* Horizontal left-to-right dark gradient overlay behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/85 via-[#0F0F0F]/40 to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-5 z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">About</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-white leading-[1.15] font-display tracking-tight [word-spacing:0.12em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Built by students <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A020] to-[#f5c76c]">
                For students with ideas
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-[#A0A0A0] leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Pitchers Club is the entrepreneurship and event management home of Manipal University
              Jaipur. We exist to turn campus ideas into impact through workshops, pitch events,
              ventures, and a community that takes you seriously from day one.
            </p>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="bg-[#0F0F0F] border-b border-[#2A2A2A] py-20 px-5">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">
              Our Story
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight uppercase font-display">
              Founded in 2023. <br />
              Built for a gap nobody else filled.
            </h2>
            <div className="mt-8 space-y-6 text-base sm:text-lg text-[#A0A0A0] leading-relaxed font-light">
              <p>
                <span className="bg-[#E8A020]/20 text-white px-2 py-0.5 rounded font-semibold border-b-2 border-[#E8A020]/40">
                  Pitchers was founded in 2023
                </span>{" "}
                by a group of students who saw a gap — Manipal University Jaipur had no dedicated
                space for entrepreneurship to actually be experienced, not just talked about. The
                idea was simple: build a club that gives every student, day scholar or hosteler, a
                real shot at learning what it takes to build something — through events, through
                hands-on roles, through responsibility from day one.
              </p>
              <p>
                In a campus with 70-plus active clubs, Pitchers carved its place by collaborating
                early and often — partnering with other clubs to host events, share resources, and
                grow a community rather than compete for one. That collaborative spirit is still
                core to how we operate today.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT WE STAND FOR / OUR VALUES */}
        <section className="bg-[#0F0F0F] py-20 px-5">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">
                Our Values
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase font-display">
                What we stand for.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Card 1 */}
              <GridPatternCard className="hover:shadow-[0_0_36px_-5px_rgba(165,0,0,0.36)] hover:border-[#A50000]/30 transition-all duration-300">
                <GridPatternCardBody>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A50000]/20 ring-1 ring-[#E8A020]/20 mb-6">
                    <Rocket className="h-5 w-5 text-[#E8A020]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#A50000] uppercase font-display mb-3">
                    Entrepreneurial Spirit
                  </h3>
                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
                    We don't just discuss startups, we run events that simulate the real thing:
                    pitching, problem-solving, decision-making under pressure.
                  </p>
                </GridPatternCardBody>
              </GridPatternCard>

              {/* Card 2 */}
              <GridPatternCard className="hover:shadow-[0_0_36px_-5px_rgba(165,0,0,0.36)] hover:border-[#A50000]/30 transition-all duration-300">
                <GridPatternCardBody>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A50000]/20 ring-1 ring-[#E8A020]/20 mb-6">
                    <Users className="h-5 w-5 text-[#E8A020]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#A50000] uppercase font-display mb-3">
                    Team Ownership
                  </h3>
                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
                    Every member, regardless of year, owns a piece of the operation. Strong team
                    management isn't a buzzword here — it's how three major events a year actually
                    happen.
                  </p>
                </GridPatternCardBody>
              </GridPatternCard>

              {/* Card 3 */}
              <GridPatternCard className="hover:shadow-[0_0_36px_-5px_rgba(165,0,0,0.36)] hover:border-[#A50000]/30 transition-all duration-300">
                <GridPatternCardBody>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A50000]/20 ring-1 ring-[#E8A020]/20 mb-6">
                    <Award className="h-5 w-5 text-[#E8A020]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#A50000] uppercase font-display mb-3">
                    Skill Over Title
                  </h3>
                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
                    Whether it's finance, design, marketing, or media, we care about what you can
                    build and learn, not how senior you are.
                  </p>
                </GridPatternCardBody>
              </GridPatternCard>

              {/* Card 4 */}
              <GridPatternCard className="hover:shadow-[0_0_36px_-5px_rgba(165,0,0,0.36)] hover:border-[#A50000]/30 transition-all duration-300">
                <GridPatternCardBody>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A50000]/20 ring-1 ring-[#E8A020]/20 mb-6">
                    <Handshake className="h-5 w-5 text-[#E8A020]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#A50000] uppercase font-display mb-3">
                    Community First
                  </h3>
                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
                    We grew by collaborating, not competing. That's still how Pitchers shows up
                    across MUJ's club ecosystem.
                  </p>
                </GridPatternCardBody>
              </GridPatternCard>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
