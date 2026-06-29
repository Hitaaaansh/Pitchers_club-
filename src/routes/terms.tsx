import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Pitchers Club" },
      {
        name: "description",
        content: "Terms of Service for Pitchers Club - Manipal University Jaipur.",
      },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans pb-20">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-32 pb-12 md:pt-40 md:pb-16 border-b border-[#2A2A2A]">
          <div className="relative mx-auto max-w-4xl px-5 z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">Legal</p>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight font-display tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-[#666666]">Last Updated: June 29, 2026</p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 px-5">
          <div className="mx-auto max-w-3xl space-y-10 text-sm sm:text-base leading-relaxed font-light">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing this website, registering for Pitchers Club events, or participating in club activities, you agree to comply with and be bound by these Terms of Service, all applicable laws and regulations, and Manipal University Jaipur campus policies.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                2. Event Registration & Participation
              </h2>
              <p>
                When registering for our events, pitches, or workshops, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your registration details. Pitchers Club reserves the right to refuse admission or disqualify participants who breach our event guidelines or the university code of conduct.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                3. Intellectual Property
              </h2>
              <p>
                All original content, designs, logos, and materials created by Pitchers Club or hosted on this site are the exclusive property of Pitchers Club - Manipal University Jaipur. You may not reproduce, distribute, or modify any materials without prior written consent from the club's leadership.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                4. Limitation of Liability
              </h2>
              <p>
                Pitchers Club operates as a student run organization. While we strive to provide excellent educational programs and events, the club and Manipal University Jaipur make no warranties regarding event outcomes or website availability. In no event shall we be liable for any direct, indirect, or incidental damages arising out of your participation in club activities.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                5. Changes to Terms
              </h2>
              <p>
                We reserve the right to revise these Terms of Service at any time. Any changes will be posted on this page with an updated revision date. By continuing to use our website or participate in events, you accept the revised terms.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                6. Contact Information
              </h2>
              <p>
                If you have any questions or concerns regarding these Terms of Service, please reach out to us at{" "}
                <a href="mailto:pitchersmuj@gmail.com" className="text-[#E8A020] hover:underline transition-all">
                  pitchersmuj@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
