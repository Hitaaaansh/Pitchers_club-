import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const Route = createFileRoute("/admin/sponsors")({
  component: AdminSponsors,
});

function AdminSponsors() {
  const { data: sponsors = [] } = useQuery({
    queryKey: ["sponsors"],
    queryFn: () => db.getSponsorInquiries(),
  });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-4xl text-white">Sponsor Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review corporate and brand partnership proposals submitted through the website.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {sponsors.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No sponsorship inquiries found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">Organization</th>
                <th className="px-5 py-3.5">Contact Person</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Message</th>
                <th className="px-5 py-3.5">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sponsors.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-semibold text-white">{s.org}</td>
                  <td className="px-5 py-4 text-white">{s.contact}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <a href={`mailto:${s.email}`} className="hover:text-crimson underline">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{s.phone}</td>
                  <td className="px-5 py-4 text-foreground/80 max-w-sm whitespace-pre-wrap leading-relaxed">
                    {s.message}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(s.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
