import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db, TeamMember } from "@/lib/db";
import { DOMAINS } from "@/lib/mock-data";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { compressImage, isImageFile } from "@/lib/utils";

export const Route = createFileRoute("/admin/team")({
  component: AdminTeam,
});

function AdminTeam() {
  const queryClient = useQueryClient();
  const { data: team = [] } = useQuery({
    queryKey: ["team"],
    queryFn: () => db.getTeam(),
  });

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    domain: "Leadership",
    year: "First Year",
    bio: "",
    photoUrl: "",
    tier: "Core team",
  });

  const yearOptions = ["First Year", "Second Year", "Third Year", "Final Year", "Alumni"];
  const domainOptions = ["Leadership", ...DOMAINS.map((d) => d.name)];
  const tierOptions = ["Club coordinator", "Executive", "Core team", "Working team"];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      toast.error(
        "Invalid file format. Please select an image file (PNG, JPEG, WebP, HEIC, etc.).",
      );
      return;
    }

    try {
      setUploading(true);
      const compressedFile = await compressImage(file, 800, 800, 0.82);
      const url = await db.uploadTeamPhoto(compressedFile);
      setFormData((prev) => ({ ...prev, photoUrl: url }));
      toast.success("Photo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  }

  function openCreateModal() {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      domain: "Leadership",
      year: "First Year",
      bio: "",
      photoUrl: "",
      tier: "Core team",
    });
    setShowModal(true);
  }

  function openEditModal(m: TeamMember) {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      domain: m.domain,
      year: m.year,
      bio: m.bio,
      photoUrl: m.photoUrl || "",
      tier: m.tier || "Core team",
    });
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.bio) {
      toast.error("Please fill all fields.");
      return;
    }

    const toastId = toast.loading(
      "Saving team member (compressing and uploading photo if external)...",
    );
    try {
      await db.saveTeamMember({
        id: editingMember?.id,
        name: formData.name,
        role: formData.role,
        domain: formData.domain,
        year: formData.year,
        bio: formData.bio,
        photoUrl: formData.photoUrl || undefined,
        tier: formData.tier,
      });

      toast.success(editingMember ? "Team member updated!" : "Team member added!", { id: toastId });
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save team member.", { id: toastId });
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await db.deleteTeamMember(id);
        toast.success("Team member removed.");
        queryClient.invalidateQueries({ queryKey: ["team"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      } catch (err: any) {
        toast.error(err.message || "Failed to delete team member.");
      }
    }
  }

  return (
    <>
      <div className="space-y-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl text-white">Team Members</h1>
            <p className="mt-1 text-sm text-[#A0A0A0]">
              Manage core team member listings, assign domains, and edit bios.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-cream hover:opacity-90 shadow-card"
          >
            <Plus size={16} /> Add member
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl text-white font-semibold">{m.name}</h3>
                    <p className="text-sm font-semibold text-crimson">{m.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {m.domain}
                    </div>
                    {m.tier && (
                      <div className="rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-semibold text-crimson uppercase tracking-wider">
                        {m.tier}
                      </div>
                    )}
                  </div>
                </div>
                {m.tier !== "Club coordinator" && (
                  <p className="mt-3 text-xs text-muted-foreground/85 uppercase tracking-wide font-medium">
                    {m.year}
                  </p>
                )}
                <p className="mt-2 text-sm text-foreground/75 leading-relaxed line-clamp-3">
                  {m.bio}
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-border/60 pt-3">
                <button
                  onClick={() => openEditModal(m)}
                  className="p-2 rounded-full bg-secondary text-foreground/80 hover:bg-border transition-colors inline-flex"
                  title="Edit Member"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors inline-flex"
                  title="Remove Member"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 p-4 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-fade-up my-8">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-2xl text-white">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-white"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Name *
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Role / Designation *
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Head of Finance"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Domain
                    </span>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                    >
                      {domainOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Year of Study
                    </span>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                    >
                      {yearOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Tier
                    </span>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                    >
                      {tierOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Photo URL (Optional)
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/... or relative path"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-medium">Or</span>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-border transition-colors">
                      <span>{uploading ? "Uploading..." : "Upload from Device"}</span>
                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        disabled={uploading}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, photoUrl: "" }))}
                        className="text-xs text-destructive hover:underline cursor-pointer"
                      >
                        Clear Photo
                      </button>
                    )}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Short Bio *
                  </span>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about this member..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                  />
                </label>

                <div className="flex gap-3 justify-end border-t border-border pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-full border border-[#2A2A2A] px-5 py-2 text-sm font-semibold text-white hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-crimson px-5 py-2 text-sm font-semibold text-cream hover:opacity-90"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
