import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db, AnnouncementItem } from "@/lib/db";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const queryClient = useQueryClient();
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => db.getAnnouncements(),
  });

  const [showModal, setShowModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState<AnnouncementItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  function openCreateModal() {
    setEditingAnn(null);
    setFormData({ title: "", body: "" });
    setShowModal(true);
  }

  function openEditModal(ann: AnnouncementItem) {
    setEditingAnn(ann);
    setFormData({ title: ann.title, body: ann.body });
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      await db.saveAnnouncement({
        id: editingAnn?.id,
        title: formData.title,
        body: formData.body,
      });

      toast.success(editingAnn ? "Announcement updated!" : "Announcement posted!");
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save announcement.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await db.deleteAnnouncement(id);
        toast.success("Announcement deleted.");
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      } catch (err: any) {
        toast.error(err.message || "Failed to delete announcement.");
      }
    }
  }

  return (
    <>
      <div className="space-y-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl text-white">Announcements</h1>
            <p className="mt-1 text-sm text-[#A0A0A0]">
              Post, edit, and archive announcements displayed on the home page.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-cream hover:opacity-90 shadow-card"
          >
            <Plus size={16} /> New announcement
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  {new Date(a.date).toDateString()}
                </p>
                <h3 className="text-2xl text-white font-semibold">{a.title}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">{a.body}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(a)}
                  className="p-2 rounded-full bg-secondary text-foreground/80 hover:bg-border transition-colors inline-flex"
                  title="Edit Announcement"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors inline-flex"
                  title="Delete Announcement"
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
                  {editingAnn ? "Edit Announcement" : "Create Announcement"}
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
                    Title *
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Message Body *
                  </span>
                  <textarea
                    rows={4}
                    required
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
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
                    Post Announcement
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
