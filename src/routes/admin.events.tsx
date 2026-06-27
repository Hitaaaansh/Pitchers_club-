import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db, cleanGoogleDriveUrl } from "@/lib/db";
import { EventItem, CustomField, EventDocument } from "@/lib/mock-data";
import { Plus, Edit2, Trash2, Lock, Unlock, Users, X, Info } from "lucide-react";
import { toast } from "sonner";
import { compressImage, isImageFile } from "@/lib/utils";

type CustomFieldForm = CustomField & { rawOptions?: string };

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

function AdminEvents() {
  const queryClient = useQueryClient();
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => db.getEvents(),
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    status: "upcoming" as "upcoming" | "past",
    registrationType: "Free" as "Free" | "Paid via Google Form" | "Paid via Razorpay",
    formLink: "",
    notes: "",
    rulesInput: "",
    scheduleInput: "",
    customFields: [] as CustomFieldForm[],
    documents: [] as EventDocument[],
    photos: [] as string[],
    cover: "",
    amount: 0,
  });

  const { data: registrants = [] } = useQuery({
    queryKey: ["registrations", selectedEventId],
    queryFn: () =>
      selectedEventId ? db.getRegistrationsByEvent(selectedEventId) : Promise.resolve([]),
    enabled: !!selectedEventId,
  });

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
      setUploadingCover(true);
      const compressedFile = await compressImage(file, 1600, 1600, 0.85);
      const url = await db.uploadEventPoster(compressedFile);
      setFormData((prev) => ({ ...prev, cover: url }));
      toast.success("Event poster uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload poster.");
    } finally {
      setUploadingCover(false);
    }
  }

  function openCreateModal() {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      status: "upcoming",
      registrationType: "Free",
      formLink: "",
      notes: "",
      rulesInput: "",
      scheduleInput: "",
      customFields: [],
      documents: [],
      photos: [],
      cover: "",
      amount: 0,
    });
    setShowModal(true);
  }

  async function openEditModal(event: EventItem) {
    const toastId = toast.loading("Loading full event details...");
    try {
      const fullEvent = await db.getEventById(event.id);
      if (!fullEvent) {
        toast.error("Failed to load event details.", { id: toastId });
        return;
      }
      toast.dismiss(toastId);
      setEditingEvent(fullEvent);
      setFormData({
        title: fullEvent.title,
        description: fullEvent.description,
        date: fullEvent.date,
        status: fullEvent.status,
        registrationType:
          fullEvent.registrationType || (fullEvent.isPaid ? "Paid via Google Form" : "Free"),
        formLink: fullEvent.formLink || "",
        notes: fullEvent.notes || "",
        rulesInput: fullEvent.rules ? fullEvent.rules.join("\n") : "",
        scheduleInput: fullEvent.schedule
          ? fullEvent.schedule.map((s) => `${s.time} - ${s.item}`).join("\n")
          : "",
        customFields: fullEvent.customFields
          ? fullEvent.customFields.map((f) => ({
              ...f,
              rawOptions: f.options ? f.options.join(", ") : "",
            }))
          : [],
        documents: fullEvent.documents || [],
        photos: fullEvent.photos || [],
        cover: fullEvent.cover || "",
        amount: fullEvent.amount || 0,
      });
      setShowModal(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to load event details.", { id: toastId });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date) {
      toast.error("Please fill required fields (Title, Description, Date).");
      return;
    }

    const rules = formData.rulesInput
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const schedule = formData.scheduleInput
      .split("\n")
      .map((line) => {
        // Try parsing using regex for common time formats: "10:00 - Item", "10:00 Item", "10:00 AM - Item", "10:00: Item", "10:00 to Item"
        const match = line.match(
          /^\s*(\d{1,2}:\d{2}\s*(?:[APap][Mm])?)\s*(?:-|–|—|:|\s|to)\s*(.*)$/,
        );
        if (match) {
          return { time: match[1].trim(), item: match[2].trim() };
        }
        // Fallback: split by common delimiters if the time format is non-standard (e.g. "TBD - Opening Keynote")
        const parts = line.split(/[-–—:]/);
        if (parts.length >= 2) {
          return { time: parts[0].trim(), item: parts.slice(1).join("-").trim() };
        }
        return null;
      })
      .filter((s): s is { time: string; item: string } => s !== null);

    const toastId = toast.loading(
      "Saving event (compressing and uploading external images if any)...",
    );
    try {
      await db.saveEvent({
        id: editingEvent?.id,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        status: formData.status,
        registrationType: formData.registrationType,
        isPaid: formData.registrationType !== "Free",
        formLink:
          formData.registrationType === "Paid via Google Form" ? formData.formLink : undefined,
        notes: formData.notes || undefined,
        customFields: formData.customFields.map(({ name, type, options }) => ({
          name,
          type,
          options: type === "dropdown" ? options : undefined,
        })),
        documents: formData.documents,
        photos: formData.photos,
        cover: formData.cover || "linear-gradient(135deg,#A50000,#1E1E1E)",
        amount: formData.registrationType === "Paid via Razorpay" ? Number(formData.amount) : 0,
        rules,
        schedule,
        problemStatementLocked: editingEvent ? editingEvent.problemStatementLocked : true,
      });

      toast.success(editingEvent ? "Event updated!" : "New event created!", { id: toastId });
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save event.", { id: toastId });
    }
  }

  async function handleDelete(id: string) {
    if (
      confirm("Are you sure you want to delete this event? This will not delete registrations.")
    ) {
      try {
        await db.deleteEvent(id);
        toast.success("Event deleted.");
        if (selectedEventId === id) setSelectedEventId(null);
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      } catch (err: any) {
        toast.error(err.message || "Failed to delete event.");
      }
    }
  }

  async function toggleLock(id: string) {
    try {
      const updated = await db.toggleProblemStatementLock(id);
      toast.success(
        `Problem statement is now ${updated?.problemStatementLocked ? "locked" : "unlocked"}!`,
      );
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to update problem statement lock status.");
    }
  }

  return (
    <>
      <div className="space-y-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl text-white">Events</h1>
            <p className="mt-1 text-sm text-[#A0A0A0]">
              Manage events listings, lock problem statements, and view registrants.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-cream hover:opacity-90 shadow-card"
          >
            <Plus size={16} /> New event
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Problem Statement</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-semibold text-white">{e.title}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(e.date).toDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold ${e.status === "upcoming" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{e.isPaid ? "Paid" : "Free"}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleLock(e.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        e.problemStatementLocked
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {e.problemStatementLocked ? <Lock size={12} /> : <Unlock size={12} />}
                      {e.problemStatementLocked ? "Locked" : "Unlocked"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedEventId(selectedEventId === e.id ? null : e.id)}
                      className={`inline-flex items-center gap-1 rounded-full p-2 text-xs font-semibold transition-colors ${
                        selectedEventId === e.id
                          ? "bg-crimson text-cream"
                          : "bg-crimson/10 text-crimson hover:bg-crimson/20"
                      }`}
                      title="View Registrants"
                    >
                      <Users size={14} />
                    </button>
                    <button
                      onClick={() => openEditModal(e)}
                      className="p-2 rounded-full bg-secondary text-foreground/80 hover:bg-border transition-colors inline-flex"
                      title="Edit Event"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors inline-flex"
                      title="Delete Event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Registrants Section */}
        {selectedEventId && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4 animate-fade-up">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-2xl text-white">
                Registrants for{" "}
                <span className="text-crimson">
                  {events.find((e) => e.id === selectedEventId)?.title || selectedEventId}
                </span>
              </h2>
              <button
                onClick={() => setSelectedEventId(null)}
                className="text-muted-foreground hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="overflow-x-auto">
              {registrants.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No registrants found for this event yet.
                </p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                      <th className="pb-3 px-2">Name</th>
                      <th className="pb-3 px-2">Registration No</th>
                      <th className="pb-3 px-2">Email</th>
                      <th className="pb-3 px-2">Contact</th>
                      <th className="pb-3 px-2">Tx ID / Source</th>
                      <th className="pb-3 px-2">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {registrants.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 px-2 font-medium text-white">{r.name}</td>
                        <td className="py-3 px-2 text-muted-foreground">{r.regNumber}</td>
                        <td className="py-3 px-2 text-muted-foreground">{r.email}</td>
                        <td className="py-3 px-2 text-muted-foreground max-w-xs truncate">
                          {r.contact}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {r.paymentScreenshotUrl ? (
                            <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              {r.paymentScreenshotUrl}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60 italic">Free Event</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(r.registeredAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 p-4 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-fade-up my-8">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-2xl text-white">
                  {editingEvent ? "Edit Event" : "Create New Event"}
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
                    Event Title *
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Date *
                    </span>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Status
                    </span>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as "upcoming" | "past" })
                      }
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-white outline-none focus:border-crimson"
                    >
                      <option value="upcoming" className="bg-[#1A1A1A] text-white">
                        Upcoming
                      </option>
                      <option value="past" className="bg-[#1A1A1A] text-white">
                        Past
                      </option>
                    </select>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Event Cover Poster URL (Optional)
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/... or relative path"
                      value={formData.cover}
                      onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-medium">Or</span>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-border transition-colors">
                      <span>{uploadingCover ? "Uploading..." : "Upload Poster from Device"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingCover}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {formData.cover && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, cover: "" }))}
                        className="text-xs text-destructive hover:underline cursor-pointer"
                      >
                        Clear Poster
                      </button>
                    )}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Description *
                  </span>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Registration Type *
                    </span>
                    <select
                      value={formData.registrationType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationType: e.target.value as any,
                        })
                      }
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-white outline-none focus:border-crimson"
                    >
                      <option value="Free" className="bg-[#1A1A1A] text-white">
                        Free
                      </option>
                      <option value="Paid via Google Form" className="bg-[#1A1A1A] text-white">
                        Paid via Google Form
                      </option>
                      <option value="Paid via Razorpay" className="bg-[#1A1A1A] text-white">
                        Paid via Razorpay
                      </option>
                    </select>
                  </label>

                  {formData.registrationType === "Paid via Google Form" && (
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Google Form Link *
                      </span>
                      <input
                        type="url"
                        required
                        placeholder="https://forms.gle/..."
                        value={formData.formLink}
                        onChange={(e) => setFormData({ ...formData, formLink: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                      />
                    </label>
                  )}

                  {formData.registrationType === "Paid via Razorpay" && (
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Registration Fee (₹) *
                      </span>
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="99"
                        value={formData.amount || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-white outline-none focus:border-crimson"
                      />
                    </label>
                  )}
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Event Notes / Notice Block (Optional)
                  </span>
                  <textarea
                    rows={2}
                    placeholder="e.g. Bring physical college ID card..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                  />
                </label>

                {/* Dynamic Custom Fields Builder */}
                <div className="space-y-2.5 rounded-xl border border-border bg-secondary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Custom Form Fields
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          customFields: [...formData.customFields, { name: "", type: "text" }],
                        })
                      }
                      className="rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-semibold text-crimson hover:bg-crimson/20 transition-colors"
                    >
                      + Add Field
                    </button>
                  </div>
                  {formData.customFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex gap-2.5 items-start border-b border-[#2A2A2A] pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Field Name (e.g. T-Shirt Size)"
                            value={field.name}
                            onChange={(e) => {
                              const updated = [...formData.customFields];
                              updated[index] = { ...field, name: e.target.value };
                              setFormData({ ...formData, customFields: updated });
                            }}
                            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-crimson"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => {
                              const updated = [...formData.customFields];
                              updated[index] = { ...field, type: e.target.value as any };
                              setFormData({ ...formData, customFields: updated });
                            }}
                            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-white outline-none focus:border-crimson"
                          >
                            <option value="text" className="bg-[#1A1A1A] text-white">
                              Text Input
                            </option>
                            <option value="number" className="bg-[#1A1A1A] text-white">
                              Number Input
                            </option>
                            <option value="dropdown" className="bg-[#1A1A1A] text-white">
                              Dropdown
                            </option>
                          </select>
                        </div>
                        {field.type === "dropdown" && (
                          <input
                            type="text"
                            required
                            placeholder="Dropdown Options (comma-separated, e.g. S, M, L)"
                            value={
                              field.rawOptions !== undefined
                                ? field.rawOptions
                                : field.options?.join(", ") || ""
                            }
                            onChange={(e) => {
                              const updated = [...formData.customFields];
                              const rawVal = e.target.value;
                              updated[index] = {
                                ...field,
                                options: rawVal
                                  .split(",")
                                  .map((o) => o.trim())
                                  .filter(Boolean),
                                rawOptions: rawVal,
                              };
                              setFormData({ ...formData, customFields: updated });
                            }}
                            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-white outline-none focus:border-crimson"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.customFields.filter((_, i) => i !== index);
                          setFormData({ ...formData, customFields: updated });
                        }}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors mt-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Dynamic Documents List Builder */}
                <div className="space-y-2.5 rounded-xl border border-border bg-secondary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Downloadable Documents
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          documents: [...formData.documents, { heading: "", url: "" }],
                        })
                      }
                      className="rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-semibold text-crimson hover:bg-crimson/20 transition-colors"
                    >
                      + Add Document
                    </button>
                  </div>
                  {formData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex gap-2.5 items-start border-b border-[#2A2A2A] pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Document Title (e.g. Rulebook)"
                          value={doc.heading}
                          onChange={(e) => {
                            const updated = [...formData.documents];
                            updated[index] = { ...doc, heading: e.target.value };
                            setFormData({ ...formData, documents: updated });
                          }}
                          className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-crimson"
                        />
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            required
                            placeholder="URL (or upload below)"
                            value={doc.url.startsWith("data:") ? "[Uploaded File]" : doc.url}
                            onChange={(e) => {
                              const updated = [...formData.documents];
                              updated[index] = { ...doc, url: e.target.value };
                              setFormData({ ...formData, documents: updated });
                            }}
                            disabled={doc.url.startsWith("data:")}
                            className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-crimson font-mono"
                          />
                          <label className="rounded bg-crimson px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer text-center whitespace-nowrap">
                            Upload File
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.docx,.doc,.txt"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const toastId = toast.loading(
                                    `Uploading "${file.name}" to storage...`,
                                  );
                                  try {
                                    const url = await db.uploadEventDocument(file);
                                    const updated = [...formData.documents];
                                    updated[index] = {
                                      ...doc,
                                      heading: doc.heading || file.name,
                                      url,
                                    };
                                    setFormData({ ...formData, documents: updated });
                                    toast.success(
                                      `Document "${file.name}" uploaded successfully!`,
                                      { id: toastId },
                                    );
                                  } catch (err: any) {
                                    console.error("Document upload error:", err);
                                    toast.error(err.message || `Failed to upload "${file.name}".`, {
                                      id: toastId,
                                    });
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.documents.filter((_, i) => i !== index);
                          setFormData({ ...formData, documents: updated });
                        }}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors mt-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Dynamic Image Gallery Builder */}
                <div className="space-y-2.5 rounded-xl border border-border bg-secondary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Image Gallery
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 font-light mt-0.5 max-w-[280px] sm:max-w-xs leading-normal">
                        Pro-tip: Paste multiple URLs (separated by newlines or commas) into a single
                        input box to add them all at once.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <label className="rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-semibold text-crimson hover:bg-crimson/20 transition-colors cursor-pointer inline-flex items-center">
                        <span>+ Upload Multiple Images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.heic,.heif"
                          className="hidden"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const fileList = Array.from(files);
                              const imageFiles = fileList.filter(isImageFile);

                              if (imageFiles.length < fileList.length) {
                                toast.warning(
                                  "Some selected files were not images/HEIC and have been skipped.",
                                );
                              }

                              if (imageFiles.length === 0) {
                                toast.error("No valid image files selected.");
                                return;
                              }

                              const total = imageFiles.length;
                              const toastId = toast.loading(
                                `Preparing to upload ${total} images...`,
                              );

                              const uploadedUrls: string[] = [];
                              let successCount = 0;
                              let failCount = 0;

                              for (let i = 0; i < total; i++) {
                                const file = imageFiles[i];
                                toast.loading(
                                  `Compressing and uploading image ${i + 1} of ${total}: "${file.name}"...`,
                                  { id: toastId },
                                );
                                try {
                                  const compressedFile = await compressImage(file, 1200, 1200, 0.8);
                                  const url = await db.uploadEventPoster(compressedFile);
                                  uploadedUrls.push(url);
                                  successCount++;
                                } catch (err: any) {
                                  console.error(`Failed to upload ${file.name}:`, err);
                                  failCount++;
                                }
                              }

                              if (successCount > 0) {
                                const currentPhotos = formData.photos.filter((p) => p !== "");
                                setFormData({
                                  ...formData,
                                  photos: [...currentPhotos, ...uploadedUrls],
                                });

                                if (failCount === 0) {
                                  toast.success(
                                    `Successfully uploaded all ${successCount} images!`,
                                    { id: toastId },
                                  );
                                } else {
                                  toast.success(
                                    `Uploaded ${successCount} of ${total} images successfully. (${failCount} failed)`,
                                    { id: toastId },
                                  );
                                }
                              } else {
                                toast.error(
                                  `Failed to upload all ${total} images. Please try again.`,
                                  { id: toastId },
                                );
                              }
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            photos: [...formData.photos, ""],
                          })
                        }
                        className="rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-semibold text-crimson hover:bg-crimson/20 transition-colors"
                      >
                        + Add Image Link
                      </button>
                    </div>
                  </div>
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="flex gap-2.5 items-center">
                      <input
                        type="text"
                        placeholder="Image URL (or select file to upload)"
                        value={photo.startsWith("data:") ? "[Base64 Data Uploaded]" : photo}
                        onChange={(e) => {
                          const val = e.target.value;
                          const urls = val
                            .split(/[\n,\s]+/)
                            .map((u) => u.trim())
                            .filter(
                              (u) =>
                                u.startsWith("http://") ||
                                u.startsWith("https://") ||
                                u.startsWith("data:"),
                            );

                          if (urls.length > 1) {
                            const cleanedUrls = urls.map(cleanGoogleDriveUrl);
                            const updated = [...formData.photos];
                            updated.splice(index, 1, ...cleanedUrls);
                            setFormData({ ...formData, photos: updated });
                            toast.success(
                              `Successfully added and resolved ${cleanedUrls.length} image links!`,
                            );
                          } else {
                            const updated = [...formData.photos];
                            const cleaned = cleanGoogleDriveUrl(val);
                            updated[index] = cleaned;
                            setFormData({ ...formData, photos: updated });
                            if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
                              toast.success("Image link added and verified!");
                            }
                          }
                        }}
                        disabled={photo.startsWith("data:")}
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-crimson font-mono"
                      />
                      <label className="rounded bg-crimson px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer text-center whitespace-nowrap">
                        Upload Image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.heic,.heif"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!isImageFile(file)) {
                                toast.error(
                                  "Invalid file format. Please select an image file (PNG, JPEG, WebP, HEIC, etc.).",
                                );
                                return;
                              }
                              const toastId = toast.loading("Compressing and uploading image...");
                              try {
                                const compressedFile = await compressImage(file, 1200, 1200, 0.8);
                                const url = await db.uploadEventPoster(compressedFile);
                                const updated = [...formData.photos];
                                updated[index] = url;
                                setFormData({ ...formData, photos: updated });
                                toast.success(`Image uploaded successfully!`, { id: toastId });
                              } catch (err: any) {
                                toast.error(err.message || "Failed to upload image.", {
                                  id: toastId,
                                });
                              }
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.photos.filter((_, i) => i !== index);
                          setFormData({ ...formData, photos: updated });
                        }}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Rules (One rule per line)
                  </span>
                  <textarea
                    rows={2}
                    value={formData.rulesInput}
                    placeholder="e.g. Teams of up to 4 members.&#10;Bring your laptop."
                    onChange={(e) => setFormData({ ...formData, rulesInput: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-crimson"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Schedule (Format: HH:MM - Item name, one per line)
                  </span>
                  <textarea
                    rows={2}
                    value={formData.scheduleInput}
                    placeholder="e.g. 10:00 - Opening Keynote&#10;11:00 - Round 1 Pitches"
                    onChange={(e) => setFormData({ ...formData, scheduleInput: e.target.value })}
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
                    Save Event
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
