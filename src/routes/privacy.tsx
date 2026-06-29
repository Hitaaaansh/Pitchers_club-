import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Pitchers Club" },
      {
        name: "description",
        content: "Privacy Policy for Pitchers Club - Manipal University Jaipur.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans pb-20">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0F0F0F] pt-32 pb-12 md:pt-40 md:pb-16 border-b border-[#2A2A2A]">
          <div className="relative mx-auto max-w-4xl px-5 z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8A020]">Legal</p>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight font-display tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-[#666666]">Last Updated: June 29, 2026</p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 px-5">
          <div className="mx-auto max-w-3xl space-y-10 text-sm sm:text-base leading-relaxed font-light">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                1. Information We Collect
              </h2>
              <p>
                We only collect personal information that is necessary for you to participate in club events, workshops, and operations. This may include:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-[#808080]">
                <li>Name and contact details (email address, phone number).</li>
                <li>University details (registration number, branch, year of study).</li>
                <li>Event registration details and feedback response data.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                2. How We Use Your Information
              </h2>
              <p>
                The information collected is used solely to manage event registrations, coordinate pitches, send updates about club activities, and enhance your club experience. We do not sell or share your personal data with external third parties for marketing purposes.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                3. Data Security
              </h2>
              <p>
                We employ standard security protocols to safeguard your personal information against unauthorized access, loss, or alteration. Access to your personal data is restricted to authorized club administration personnel.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                4. Third-Party Services
              </h2>
              <p>
                Our platform utilizes services such as Supabase and Vercel for database management and hosting. These providers handle your data in accordance with their respective privacy policies.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                5. Your Rights
              </h2>
              <p>
                You have the right to request access to the personal data we hold about you, or to request its correction or deletion. To make a request, please contact us at the email provided below.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                6. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
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
