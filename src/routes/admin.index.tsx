import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Calendar, Megaphone, Users, Landmark, Clock, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => db.getStats(),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => db.getEvents(),
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => db.getRegistrations(),
  });

  const { data: sponsors = [] } = useQuery({
    queryKey: ["sponsors"],
    queryFn: () => db.getSponsorInquiries(),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => db.getContactSubmissions(),
  });

  const statsItems = [
    { label: "Upcoming Events", value: stats?.upcomingEvents ?? 0, icon: Calendar },
    { label: "Announcements", value: stats?.activeAnnouncements ?? 0, icon: Megaphone },
    { label: "Team Members", value: stats?.teamMembers ?? 0, icon: Users },
    { label: "Total Registrants", value: stats?.totalRegistrations ?? 0, icon: Landmark },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-4xl text-white">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here's a live snapshot of Pitchers Club activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsItems.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between shadow-soft"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {s.label}
              </div>
              <div className="mt-2 font-display text-4xl text-crimson">{s.value}</div>
            </div>
            <div className="rounded-xl bg-crimson/10 p-3 text-crimson">
              <s.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-xl text-white flex items-center justify-between">
            Recent Registrations
            <Clock size={16} className="text-muted-foreground" />
          </h2>
          <div className="mt-4 overflow-x-auto">
            {registrations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No registrations yet.
              </p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Event</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {registrations.slice(0, 5).map((r) => {
                    const event = events.find((e) => e.id === r.eventId);
                    return (
                      <tr key={r.id}>
                        <td className="py-2.5 font-medium text-white">{r.name}</td>
                        <td className="py-2.5 text-muted-foreground">
                          {r.eventId === "membership"
                            ? "Membership Application"
                            : (event?.title ?? r.eventId)}
                        </td>
                        <td className="py-2.5 text-muted-foreground">
                          {new Date(r.registeredAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Sponsor Inquiries */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-xl text-white flex items-center justify-between">
            Sponsor Inquiries
            <Landmark size={16} className="text-muted-foreground" />
          </h2>
          <div className="mt-4 overflow-x-auto">
            {sponsors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No inquiries yet.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                    <th className="pb-2">Organization</th>
                    <th className="pb-2">Contact</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sponsors.slice(0, 5).map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 font-medium text-white">{s.org}</td>
                      <td className="py-2.5 text-muted-foreground">{s.contact}</td>
                      <td className="py-2.5 text-muted-foreground">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Contact Submissions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-xl text-white">Recent Messages (Contact Us)</h2>
        <div className="mt-4 overflow-x-auto">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No messages yet.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Message</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contacts.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 font-medium text-white">{c.name}</td>
                    <td className="py-2.5 text-muted-foreground">{c.email}</td>
                    <td className="py-2.5 text-muted-foreground max-w-xs truncate">{c.message}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
