import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db, JoinSubmission } from "@/lib/db";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/joiners")({
  component: AdminJoiners,
});

function AdminJoiners() {
  const queryClient = useQueryClient();

  const { data: joiners = [] } = useQuery({
    queryKey: ["joiners"],
    queryFn: () => db.getJoinSubmissions(),
  });

  const { data: recruitmentOpen = true } = useQuery({
    queryKey: ["recruitmentOpen"],
    queryFn: () => db.getRecruitmentOpen(),
  });

  async function handleToggleRecruitment(checked: boolean) {
    try {
      await db.setRecruitmentOpen(checked);
      queryClient.invalidateQueries({ queryKey: ["recruitmentOpen"] });
      toast.success(checked ? "Recruitment form is now OPEN." : "Recruitment form is now CLOSED.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update recruitment status.");
    }
  }

  async function handleStatusChange(id: string, status: JoinSubmission["status"]) {
    try {
      await db.updateJoinSubmissionStatus(id, status);
      queryClient.invalidateQueries({ queryKey: ["joiners"] });
      toast.success("Application status updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this submission?")) {
      try {
        await db.deleteJoinSubmission(id);
        queryClient.invalidateQueries({ queryKey: ["joiners"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
        toast.success("Submission deleted.");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete submission.");
      }
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl text-white">Joiners Applications</h1>
          <p className="mt-1 text-sm text-[#A0A0A0]">
            Review membership applications and manage public Join Us form status.
          </p>
        </div>

        {/* Toggle Box */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-5 py-3.5 shadow-soft">
          <span className="text-sm font-semibold text-white">
            Recruitment: {recruitmentOpen ? "OPEN" : "CLOSED"}
          </span>
          <Switch checked={recruitmentOpen} onCheckedChange={handleToggleRecruitment} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-soft">
        {joiners.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#A0A0A0]">
            No applications submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1F1F1F] text-xs uppercase tracking-widest text-[#A0A0A0] font-semibold border-b border-[#2A2A2A]">
                <tr>
                  <th className="px-5 py-4">Full Name</th>
                  <th className="px-5 py-4">Reg Number</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Year of Study</th>
                  <th className="px-5 py-4">Domain</th>
                  <th className="px-5 py-4">Submitted At</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A] text-white/95">
                {joiners.map((j) => (
                  <tr key={j.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{j.name}</div>
                      {j.why && (
                        <p
                          className="text-xs text-[#A0A0A0] font-light mt-1 max-w-xs italic line-clamp-2"
                          title={j.why}
                        >
                          "{j.why}"
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">{j.regNumber}</td>
                    <td className="px-5 py-4 text-[#A0A0A0] hover:text-white">
                      <a href={`mailto:${j.email}`} className="underline">
                        {j.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-[#A0A0A0]">{j.mobile}</td>
                    <td className="px-5 py-4 text-xs">{j.year}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-semibold text-crimson uppercase tracking-wider">
                        {j.domain}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#A0A0A0]">
                      {new Date(j.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={j.status}
                        onChange={(e) =>
                          handleStatusChange(j.id, e.target.value as JoinSubmission["status"])
                        }
                        className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-2 py-1 text-xs text-white outline-none focus:border-crimson"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Joined">Joined</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors inline-flex"
                        title="Delete Application"
                      >
                        <Trash2 size={14} />
                      </button>
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
