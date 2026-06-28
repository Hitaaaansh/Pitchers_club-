import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EVENTS, CustomField, EventDocument } from "@/lib/mock-data";
import { useState } from "react";
import { verifyPaymentAndRegister } from "@/lib/api/events.functions";
import {
  Calendar,
  Lock,
  Unlock,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import WarpShaderHero from "@/components/ui/wrap-shader";
import blackoutImg from "@/assets/PROJECT BLACKOUT.png";
import pitchImg from "@/assets/WhatsApp Image 2025-10-16 at 10.21.56_53d56303.jpg";
import strtup from "@/assets/img/EMAIL POSTER.png";
import seminar from "@/assets/img/Busines.png";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const slugify = (text: string) =>
      text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");

    // Return event from mock data as static initial fallback to help SSR/hydration
    const event = EVENTS.find(
      (e) => e.id === params.eventId || slugify(e.title) === params.eventId,
    );
    return { initialEvent: event, eventId: params.eventId };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.initialEvent?.title ?? "Event"} — Pitchers Club` },
      { name: "description", content: loaderData?.initialEvent?.description ?? "" },
    ],
  }),
  component: EventDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen flex items-center justify-center font-sans text-[#A0A0A0]">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h1 className="text-5xl font-bold uppercase text-white font-display">Event not found</h1>
          <Link to="/events" className="mt-6 inline-block text-crimson hover:underline">
            ← Back to events
          </Link>
        </div>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen flex items-center justify-center font-sans text-[#A0A0A0]">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h1 className="text-4xl font-bold uppercase text-white font-display">
            Something went wrong loading this event.
          </h1>
        </div>
      </div>
    </SiteLayout>
  ),
});

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function EventDetail() {
  const { initialEvent, eventId } = Route.useLoaderData();
  const queryClient = useQueryClient();

  const { data: rawEvent, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => db.getEventById(eventId),
    initialData: initialEvent,
  });

  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ["eventMedia", rawEvent?.id],
    queryFn: () => db.getEventMedia(rawEvent!.id),
    enabled: !!rawEvent?.id,
  });

  const [form, setForm] = useState({ name: "", regNumber: "", email: "", contact: "" });
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [showStickyBtn, setShowStickyBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button when scrolled past 250px (below the hero image)
      setShowStickyBtn(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const eventImages: Record<string, string> = {
    "Bayaan-2025": pitchImg,
    Bayaan: pitchImg,
    "Project Blackout 2026": blackoutImg,
    "Project Blackout": blackoutImg,
    "Startup-Forge 2026": strtup,
    "Startup-Forge": strtup,
    "Startup with a soul": seminar,
    "Startup with soul": seminar,
    "Startup witha a soul": seminar,
    "Startup witha soul": seminar,
    "founders-pitch-2026": pitchImg,
    "ideathon-spring": blackoutImg,
  };
  const defaultEventImage =
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";

  const getEventImage = (item: { id: string; title: string }) => {
    const normalize = (str: string) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchedKey = Object.keys(eventImages).find((key) => {
      const normKey = normalize(key);
      return normKey === normalize(item.id) || normKey === normalize(item.title);
    });
    return matchedKey ? eventImages[matchedKey] : defaultEventImage;
  };

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="bg-[#0F0F0F] min-h-screen flex items-center justify-center font-sans text-[#A0A0A0]">
          <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
            Loading Event Details...
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!rawEvent) {
    return (
      <SiteLayout>
        <div className="bg-[#0F0F0F] min-h-screen flex items-center justify-center font-sans text-[#A0A0A0]">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h1 className="text-4xl font-bold uppercase text-white font-display">
              Event not found
            </h1>
            <Link to="/events" className="mt-6 inline-block text-crimson hover:underline">
              ← Back to events
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const event = rawEvent;

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.regNumber || !form.contact) {
      toast.error("Please fill all fields.");
      return;
    }

    if (event.registrationType === "Paid via Razorpay") {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }

      const rawKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      const keyId =
        rawKey && rawKey !== "your-razorpay-key-id" ? rawKey : "rzp_test_T6BIAE3I7rIuWO";

      // Sanitize prefill contact digits to prevent Razorpay validation errors
      const digitsOnly = form.contact.replace(/\D/g, "");
      const sanitizedContact = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : undefined;

      const options = {
        key: keyId,
        amount: (event.amount || 99) * 100, // Amount in paise
        currency: "INR",
        name: "Pitchers Club MUJ",
        description: `Registration for ${event.title}`,
        prefill: {
          name: form.name,
          email: form.email,
          contact: sanitizedContact,
        },
        theme: {
          color: "#A50000",
        },
        handler: function (response: any) {
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id || undefined;
          const signature = response.razorpay_signature || undefined;

          toast.success("Payment successful! Registering...");
          submitRegistration(paymentId, orderId, signature);
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      submitRegistration();
    }
  }

  async function submitRegistration(txId?: string, orderId?: string, signature?: string) {
    try {
      const customFieldsString =
        event.customFields && event.customFields.length > 0
          ? event.customFields.map((f) => `${f.name}: ${customAnswers[f.name] || ""}`).join(" | ")
          : "";
      const finalContact = customFieldsString
        ? `${form.contact} | ${customFieldsString}`
        : form.contact;

      // 1. Invoke the secure server-side verification function first
      if (txId) {
        const verification = await verifyPaymentAndRegister({
          data: {
            eventId: event.id,
            name: form.name,
            regNumber: form.regNumber,
            email: form.email,
            contact: finalContact,
            paymentId: txId,
            orderId,
            signature,
          },
        });

        if (!verification.success) {
          throw new Error("Server payment verification failed");
        }
      }

      // 2. Once verified by the server, write to client database (localStorage mock)
      await db.addRegistration({
        eventId: event.id,
        name: form.name,
        regNumber: form.regNumber,
        email: form.email,
        contact: finalContact,
        paymentScreenshotUrl: txId || undefined,
      });

      if (txId) {
        toast.success("Payment Verified! Ticket confirmed.", {
          description: `Transaction ID: ${txId}. We've sent verification details to ${form.email}. Get ready to lead!`,
          duration: 7000,
        });
      } else {
        toast.success("Registration successful! See you at the event.");
      }
      setForm({ name: "", regNumber: "", email: "", contact: "" });
      setCustomAnswers({});
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to complete registration.");
    }
  }

  async function handlePaymentSuccess() {
    const mockTxId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    // Simulate generating the cryptographic signature (Razorpay checkout would return this callback)
    const secret = "mock_razorpay_secret_key_for_testing";
    let mockSignature = "";
    try {
      const enc = new TextEncoder();
      const key = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"],
      );
      const signatureBuffer = await window.crypto.subtle.sign(
        "HMAC",
        key,
        enc.encode(`${mockOrderId}|${mockTxId}`),
      );
      mockSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (e) {
      console.error("Signature generation failed in client:", e);
    }

    setShowRazorpay(false);
    submitRegistration(mockTxId, mockOrderId, mockSignature);
  }

  function handlePaymentCancel() {
    setShowRazorpay(false);
    toast.error("Payment cancelled.");
  }

  return (
    <SiteLayout>
      <div className="bg-[#0F0F0F] min-h-screen text-[#A0A0A0] font-sans">
        {/* HERO */}
        <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 border-b border-[#2A2A2A] bg-[#0F0F0F]">
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 z-10 text-white">
            <Link
              to="/events"
              className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E8A020] hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to events
            </Link>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white leading-tight font-display">
              {event.title}
            </h1>
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#666666]">
              <Calendar size={14} className="text-[#E8A020]" />{" "}
              {new Date(event.date).toDateString()}
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="section-pad bg-[#0F0F0F]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-10">
              {/* About */}
              <div>
                <h2 className="text-3xl font-bold text-white uppercase font-display mb-4">About</h2>
                <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
                  {event.description}
                </p>
              </div>

              {/* Event Notes / Notice Block */}
              {event.notes && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-soft text-amber-500 flex gap-3 items-start animate-fade-in">
                  <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
                      Important Notice
                    </h4>
                    <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-light">
                      {event.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-white uppercase font-display mb-4">
                    Schedule
                  </h2>
                  <ul className="divide-y divide-[#2A2A2A] rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] overflow-hidden">
                    {event.schedule.map((s) => (
                      <li key={s.time} className="flex gap-4 px-5 py-4">
                        <span className="w-20 font-mono text-sm font-bold text-crimson">
                          {s.time}
                        </span>
                        <span className="text-sm text-[#A0A0A0] font-light">{s.item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rules */}
              {event.rules && event.rules.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-white uppercase font-display mb-4">
                    Rules
                  </h2>
                  <ul className="space-y-3 font-light text-[#A0A0A0] leading-relaxed">
                    {event.rules.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span className="text-crimson font-bold">·</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents & Resources */}
              {((media?.documents && media.documents.length > 0) ||
                event.problemStatementLocked ||
                isMediaLoading) && (
                <div>
                  <h2 className="text-3xl font-bold text-white uppercase font-display mb-4">
                    Documents & Resources
                  </h2>
                  <div className="space-y-3">
                    {isMediaLoading ? (
                      <div className="space-y-2">
                        <div className="h-14 w-full rounded-2xl bg-white/[0.03] animate-pulse border border-[#2a2a2a]" />
                        <div className="h-14 w-full rounded-2xl bg-white/[0.03] animate-pulse border border-[#2a2a2a]" />
                      </div>
                    ) : media?.documents && media.documents.length > 0 ? (
                      media.documents.map((doc, idx) => {
                        const isOnlyDoc = media.documents && media.documents.length === 1;
                        const hasKeyword = [
                          "problem",
                          "ps",
                          "challenge",
                          "prompt",
                          "statement",
                          "task",
                        ].some((keyword) => doc.heading.toLowerCase().includes(keyword));
                        const isLocked = event.problemStatementLocked && (isOnlyDoc || hasKeyword);

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 shadow-soft"
                          >
                            <div className="flex items-center gap-3">
                              {isLocked ? (
                                <Lock className="text-[#666666]" size={18} />
                              ) : (
                                <Unlock className="text-[#E8A020]" size={18} />
                              )}
                              <div>
                                <p className="text-sm font-semibold text-white">{doc.heading}</p>
                                {isLocked && (
                                  <p className="text-xs text-[#666666] font-light">
                                    Locked. Unlocks 48 hours before the event.
                                  </p>
                                )}
                              </div>
                            </div>
                            {!isLocked && (
                              <a
                                href={doc.url}
                                download={doc.heading}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold uppercase tracking-wider text-crimson hover:underline"
                              >
                                Download
                              </a>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      event.problemStatementLocked && (
                        <div className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-soft">
                          <Lock className="text-[#666666]" size={18} />
                          <p className="text-sm text-[#666666] font-light">
                            Document is locked. Unlocks 48 hours before the event.
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Photos Gallery */}
              <div>
                <h2 className="text-3xl font-bold text-white uppercase font-display mb-4">
                  Gallery
                </h2>
                {isMediaLoading ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-[#2A2A2A] aspect-[4/3] bg-white/[0.03] animate-pulse" />
                    <div className="rounded-xl border border-[#2A2A2A] aspect-[4/3] bg-white/[0.03] animate-pulse" />
                    <div className="rounded-xl border border-[#2A2A2A] aspect-[4/3] bg-white/[0.03] animate-pulse" />
                  </div>
                ) : media?.photos && media.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {media.photos.map((p, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-xl border border-[#2A2A2A] aspect-[4/3] cursor-pointer group hover:border-crimson/50 hover:shadow-[0_0_20px_rgba(165,0,0,0.1)] transition-all duration-300"
                        onClick={() => setLightboxPhoto(p)}
                      >
                        <img
                          src={p}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/75 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                            Enlarge
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm animate-fade-in shadow-soft mt-2">
                    <p className="text-base font-semibold text-white font-display uppercase tracking-widest">
                      No event memories
                    </p>
                    <p className="mt-2 text-xs text-[#A0A0A0] font-light tracking-wide">
                      We're working on it! Photos will be uploaded and available soon.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Sidebar */}
            <aside id="registration-section" className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white uppercase font-display">Register</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      event.registrationType === "Paid via Google Form" ||
                      event.registrationType === "Paid via Razorpay"
                        ? "bg-[#E8A020]/20 text-[#E8A020] border border-[#E8A020]/30 animate-pulse"
                        : "bg-crimson/20 text-crimson border border-crimson/30"
                    }`}
                  >
                    {event.registrationType || (event.isPaid ? "Paid" : "Free")}
                  </span>
                </div>

                {event.status === "past" && (
                  <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-[11px] leading-relaxed text-red-400 flex gap-2 items-start animate-fade-in">
                    <AlertCircle className="shrink-0 mt-0.5 text-red-500" size={14} />
                    <div>Registrations are closed as this event has already concluded.</div>
                  </div>
                )}

                {event.registrationType === "Paid via Google Form" ? (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-light">
                      This event uses Google Forms for registration and payments.
                    </p>
                    {event.status === "past" ? (
                      <button
                        disabled
                        className="w-full rounded-full bg-neutral-800 border border-neutral-700/50 px-5 py-3 text-sm font-semibold text-neutral-500 cursor-not-allowed font-display uppercase tracking-wider"
                      >
                        Registrations Closed
                      </button>
                    ) : (
                      <a
                        href={event.formLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-center block rounded-full bg-crimson px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_-3px_rgba(165,0,0,0.5)] hover:opacity-95 cursor-pointer font-display uppercase tracking-wider"
                      >
                        Register now
                      </a>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <Input
                      label="Full name"
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                      disabled={event.status === "past"}
                    />
                    <Input
                      label="Registration no."
                      value={form.regNumber}
                      onChange={(v) => setForm({ ...form, regNumber: v })}
                      disabled={event.status === "past"}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      disabled={event.status === "past"}
                    />
                    <Input
                      label="Contact"
                      value={form.contact}
                      onChange={(v) => setForm({ ...form, contact: v })}
                      disabled={event.status === "past"}
                    />

                    {/* Custom Form Fields */}
                    {event.customFields &&
                      event.customFields.map((field) => (
                        <div key={field.name} className="block">
                          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
                            {field.name} <span className="text-crimson font-normal">*</span>
                          </span>
                          {field.type === "dropdown" ? (
                            <select
                              disabled={event.status === "past"}
                              value={customAnswers[field.name] || ""}
                              onChange={(e) =>
                                setCustomAnswers({ ...customAnswers, [field.name]: e.target.value })
                              }
                              required={event.status !== "past"}
                              className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="" className="bg-[#1A1A1A] text-white">
                                Select option
                              </option>
                              {field.options &&
                                field.options.map((opt) => (
                                  <option key={opt} value={opt} className="bg-[#1A1A1A] text-white">
                                    {opt}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <input
                              disabled={event.status === "past"}
                              type={field.type === "number" ? "number" : "text"}
                              value={customAnswers[field.name] || ""}
                              onChange={(e) =>
                                setCustomAnswers({ ...customAnswers, [field.name]: e.target.value })
                              }
                              required={event.status !== "past"}
                              className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          )}
                        </div>
                      ))}

                    {event.registrationType === "Paid via Razorpay" && event.status !== "past" && (
                      <div className="rounded-lg border border-[#E8A020]/20 bg-[#E8A020]/5 p-3 text-[11px] leading-relaxed text-[#A0A0A0]">
                        <AlertCircle className="mb-0.5 inline mr-1 text-[#E8A020]" size={12} />
                        This is a paid event (₹{event.amount || 99}.00). Clicking Proceed will open
                        the secure Razorpay payment window.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={event.status === "past"}
                      className={`w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition-all duration-300 font-display uppercase tracking-wider
                        ${
                          event.status === "past"
                            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50"
                            : "bg-crimson hover:shadow-[0_0_20px_-3px_rgba(165,0,0,0.5)] hover:opacity-95 cursor-pointer"
                        }`}
                    >
                      {event.status === "past"
                        ? "Registrations Closed"
                        : event.registrationType === "Paid via Razorpay"
                          ? "Proceed to Pay & Register"
                          : "Register"}
                    </button>
                  </form>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F0F]/90 p-4 animate-fade-in backdrop-blur-md cursor-pointer"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-2 shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto}
              alt="Enlarged gallery view"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-crimson bg-[#0F0F0F]/80 p-2 rounded-full transition-colors font-bold text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {showStickyBtn && event.status !== "past" && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 w-[92%] md:hidden animate-fade-in">
          <button
            onClick={() => {
              const el = document.getElementById("registration-section");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="w-full rounded-full bg-crimson py-3 text-center text-sm font-semibold text-white shadow-lg border border-white/10 font-display uppercase tracking-wider transition-all duration-300 hover:scale-[1.02]"
          >
            Register for Event
          </button>
        </div>
      )}
    </SiteLayout>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}

function Input({ label, value, onChange, type = "text", disabled = false }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#666666]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        required={!disabled}
      />
    </label>
  );
}
