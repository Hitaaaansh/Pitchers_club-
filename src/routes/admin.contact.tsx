import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { Check, MailOpen, Mail, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/contact")({
  component: AdminContact,
});

function AdminContact() {
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => db.getContactSubmissions(),
  });

  async function handleToggleRead(id: string) {
    try {
      await db.toggleContactSubmissionRead(id);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Message status updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update message status.");
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-4xl text-white">Contact Messages</h1>
        <p className="mt-1 text-sm text-[#A0A0A0]">
          View and manage contact inquiries sent by users via the public contact form.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-soft">
        {contacts.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#A0A0A0]">No messages received yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1F1F1F] text-xs uppercase tracking-widest text-[#A0A0A0] font-semibold border-b border-[#2A2A2A]">
                <tr>
                  <th className="px-5 py-4 w-48">Name</th>
                  <th className="px-5 py-4 w-60">Email</th>
                  <th className="px-5 py-4">Message</th>
                  <th className="px-5 py-4 w-48">Received At</th>
                  <th className="px-5 py-4 w-32 text-center">Status</th>
                  <th className="px-5 py-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A] text-white/95">
                {contacts.map((c) => (
                  <tr
                    key={c.id}
                    className={`transition-colors hover:bg-white/5 ${
                      c.read ? "opacity-60" : "font-semibold bg-[#A50000]/5"
                    }`}
                  >
                    <td className="px-5 py-4 text-white">{c.name}</td>
                    <td className="px-5 py-4 text-[#A0A0A0] hover:text-white">
                      <a href={`mailto:${c.email}`} className="underline">
                        {c.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 whitespace-pre-wrap leading-relaxed">{c.message}</td>
                    <td className="px-5 py-4 text-xs text-[#A0A0A0]">
                      {new Date(c.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          c.read
                            ? "bg-[#2A2A2A] text-[#A0A0A0]"
                            : "bg-crimson/20 text-crimson border border-crimson/30 animate-pulse"
                        }`}
                      >
                        {c.read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleRead(c.id)}
                          className={`p-2 rounded-full transition-colors inline-flex ${
                            c.read
                              ? "bg-secondary text-[#A0A0A0] hover:bg-[#333333] hover:text-white"
                              : "bg-crimson/10 text-crimson hover:bg-crimson/20"
                          }`}
                          title={c.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          {c.read ? <Mail size={14} /> : <MailOpen size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
