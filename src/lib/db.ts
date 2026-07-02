import { createClient } from "@supabase/supabase-js";
import { EVENTS, ANNOUNCEMENTS, TEAM, EventItem, TeamMember, AnnouncementItem } from "./mock-data";
import { compressExternalImage, compressExternalDocument } from "./api/image.functions";
import { compressDocument } from "./utils";

export type RegistrationItem = {
  id: string;
  eventId: string;
  name: string;
  regNumber: string;
  email: string;
  contact: string;
  paymentScreenshotUrl?: string;
  registeredAt: string;
};

export type SponsorInquiryItem = {
  id: string;
  org: string;
  contact: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
};

export type ContactItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  read?: boolean;
};

export type JoinSubmission = {
  id: string;
  name: string;
  regNumber: string;
  email: string;
  mobile: string;
  year: string;
  domain: string;
  why?: string;
  status: "Pending" | "Contacted" | "Joined" | "Rejected";
  submittedAt: string;
};

// Check if Supabase keys are configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseUrl !== "your-supabase-project-url" &&
  supabaseAnonKey &&
  supabaseAnonKey !== "your-supabase-anon-key";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// LocalStorage Fallback helper keys
const KEYS = {
  EVENTS: "pitchers_db_events",
  ANNOUNCEMENTS: "pitchers_db_announcements",
  TEAM: "pitchers_db_team",
  REGISTRATIONS: "pitchers_db_registrations",
  SPONSORS: "pitchers_db_sponsors",
  CONTACTS: "pitchers_db_contacts",
  JOINERS: "pitchers_db_joiners",
  RECRUITMENT_OPEN: "pitchers_db_recruitment_open",
};

const isClient = typeof window !== "undefined";

function getLocalData<T>(key: string, defaultData: T[]): T[] {
  if (!isClient) return defaultData;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultData;
  }
}

function setLocalData<T>(key: string, data: T[]) {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function cleanGoogleDriveUrl(url: string): string {
  if (!url) return url;

  // Pattern 1: https://drive.google.com/file/d/IMAGE_ID/view...
  const fileDRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  let match = url.match(fileDRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  // Pattern 2: https://drive.google.com/open?id=IMAGE_ID
  const openIdRegex = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  match = url.match(openIdRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  // Pattern 3: https://drive.google.com/uc?id=IMAGE_ID or export=view&id=IMAGE_ID
  const ucIdRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
  if (url.includes("drive.google.com/uc") || url.includes("drive.google.com/open")) {
    match = url.match(ucIdRegex);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  return url;
}

// Model Mappers for Supabase (Snake Case to Camel Case)
const mapEventFromDB = (e: any): EventItem => ({
  id: e.id,
  title: e.title,
  description: e.description,
  date: e.date,
  status: e.status,
  registrationType: e.registration_type,
  formLink: e.form_link,
  cover: e.cover,
  rules: e.rules,
  schedule: e.schedule,
  photos: e.photos || [],
  notes: e.notes,
  isPaid: e.is_paid,
  problemStatementLocked: e.problem_statement_locked,
  customFields: e.custom_fields,
  documents: e.documents || [],
  amount: e.amount || 0,
});

const mapEventToDB = (e: Omit<EventItem, "id"> & { id?: string }) => ({
  title: e.title,
  description: e.description,
  date: e.date,
  status: e.status,
  registration_type: e.registrationType,
  form_link: e.formLink,
  cover: e.cover ? cleanGoogleDriveUrl(e.cover) : e.cover,
  rules: e.rules || [],
  schedule: e.schedule || [],
  photos: (e.photos || []).map(cleanGoogleDriveUrl),
  notes: e.notes,
  is_paid: e.isPaid,
  problem_statement_locked: e.problemStatementLocked,
  custom_fields: e.customFields || [],
  documents: e.documents || [],
  amount: e.amount || 0,
});

const mapTeamFromDB = (m: any): TeamMember => ({
  id: m.id,
  name: m.name,
  role: m.role,
  domain: m.domain,
  year: m.year,
  bio: m.bio || "",
  photoUrl: m.photo_url || undefined,
  tier: m.tier,
});

const mapTeamToDB = (m: Omit<TeamMember, "id"> & { id?: string }) => ({
  name: m.name,
  role: m.role,
  domain: m.domain,
  year: m.year,
  bio: m.bio,
  photo_url: m.photoUrl ? cleanGoogleDriveUrl(m.photoUrl) : m.photoUrl,
  tier: m.tier,
});

async function ensureCompressedSupabaseUrl(
  url: string | undefined,
  uploadFn: (file: File) => Promise<string>,
): Promise<string> {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && url.startsWith(supabaseUrl)) {
    return url;
  }

  const cleanedUrl = cleanGoogleDriveUrl(url);
  if (supabaseUrl && cleanedUrl.startsWith(supabaseUrl)) {
    return cleanedUrl;
  }

  if (!supabase) {
    return cleanedUrl;
  }

  console.log(`[db.ts] Compressing and uploading external URL to Supabase: ${cleanedUrl}`);
  try {
    const res = await compressExternalImage({ data: { url: cleanedUrl } });
    if (res && res.success && res.base64Data) {
      const response = await fetch(res.base64Data);
      const blob = await response.blob();

      const ext = res.format || "webp";
      const fileName = `converted-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const file = new File([blob], fileName, { type: blob.type });

      const supabaseUrlResult = await uploadFn(file);
      console.log(
        `[db.ts] Successfully converted external url: ${cleanedUrl} -> ${supabaseUrlResult}`,
      );
      return supabaseUrlResult;
    } else {
      console.error(
        `[db.ts] Server side compression failed for ${cleanedUrl}:`,
        res?.error || "Unknown error",
      );
    }
  } catch (err) {
    console.error(`[db.ts] Error resolving external URL ${cleanedUrl}:`, err);
  }

  return cleanedUrl;
}

async function ensureCompressedDocumentSupabaseUrl(
  url: string | undefined,
  uploadFn: (file: File) => Promise<string>,
): Promise<string> {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && url.startsWith(supabaseUrl)) {
    return url;
  }

  const cleanedUrl = cleanGoogleDriveUrl(url);
  if (supabaseUrl && cleanedUrl.startsWith(supabaseUrl)) {
    return cleanedUrl;
  }

  if (!supabase) {
    return cleanedUrl;
  }

  console.log(`[db.ts] Processing and uploading external document to Supabase: ${cleanedUrl}`);
  try {
    const res = await compressExternalDocument({ data: { url: cleanedUrl } });
    if (res && res.success && res.base64Data) {
      const response = await fetch(res.base64Data);
      const blob = await response.blob();

      const fileName = res.fileName || `doc-${Date.now()}`;
      const file = new File([blob], fileName, { type: res.contentType || blob.type });

      const supabaseUrlResult = await uploadFn(file);
      console.log(
        `[db.ts] Successfully processed external document: ${cleanedUrl} -> ${supabaseUrlResult}`,
      );
      return supabaseUrlResult;
    } else {
      console.error(
        `[db.ts] Server side document processing failed for ${cleanedUrl}:`,
        res?.error || "Unknown error",
      );
    }
  } catch (err) {
    console.error(`[db.ts] Error resolving external document ${cleanedUrl}:`, err);
  }

  return cleanedUrl;
}

export const db = {
  // --- Events ---
  async getEvents(): Promise<EventItem[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, title, description, date, status, registration_type, form_link, cover, rules, schedule, notes, is_paid, problem_statement_locked, custom_fields, amount",
        )
        .order("date", { ascending: false });
      if (!error && data) {
        return data.map(mapEventFromDB);
      }
      console.error("Error fetching events from Supabase:", error);
    }

    // Fallback to localStorage
    const list = getLocalData<EventItem>(KEYS.EVENTS, EVENTS);
    let updated = false;
    const cleanedList = list.map((item) => {
      if (
        item.photos &&
        item.photos.length > 0 &&
        item.photos.some((p) => p.includes("unsplash.com"))
      ) {
        updated = true;
        return { ...item, photos: [] };
      }
      return item;
    });
    if (updated) {
      cleanedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLocalData(KEYS.EVENTS, cleanedList);
      return cleanedList;
    }
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  },

  async getEventById(idOrSlug: string): Promise<EventItem | undefined> {
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

    if (supabase) {
      // 1. Try to fetch by ID directly if it's a UUID pattern
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(idOrSlug)) {
        const { data, error } = await supabase
          .from("events")
          .select(
            "id, title, description, date, status, registration_type, form_link, cover, rules, schedule, notes, is_paid, problem_statement_locked, custom_fields, amount, photos, documents",
          )
          .eq("id", idOrSlug)
          .single();
        if (!error && data) {
          return mapEventFromDB(data);
        }
      }

      // 2. If it's a slug, fetch only the id and title of all events to resolve the slug (super fast!)
      const { data: list, error } = await supabase.from("events").select("id, title");
      if (!error && list) {
        const found = list.find((e) => e.id === idOrSlug || slugify(e.title) === idOrSlug);
        if (found) {
          const { data: fullEvent, error: fullError } = await supabase
            .from("events")
            .select(
              "id, title, description, date, status, registration_type, form_link, cover, rules, schedule, notes, is_paid, problem_statement_locked, custom_fields, amount, photos, documents",
            )
            .eq("id", found.id)
            .single();
          if (!fullError && fullEvent) {
            return mapEventFromDB(fullEvent);
          }
        }
      }
      console.error("Error fetching event by ID/Slug from Supabase");
    }

    // Fallback to localStorage
    const list = getLocalData<EventItem>(KEYS.EVENTS, EVENTS);
    return list.find((e) => e.id === idOrSlug || slugify(e.title) === idOrSlug);
  },

  async getEventMedia(id: string): Promise<{ photos: string[]; documents: EventDocument[] }> {
    if (supabase) {
      const { data, error } = await supabase
        .from("events")
        .select("photos, documents")
        .eq("id", id)
        .single();
      if (!error && data) {
        return {
          photos: (data.photos || []).map(cleanGoogleDriveUrl),
          documents: data.documents || [],
        };
      }
      console.error("Error fetching event media from Supabase:", error);
    }

    // Fallback to localStorage / mock-data
    const list = getLocalData<EventItem>(KEYS.EVENTS, EVENTS);
    const found = list.find((e) => e.id === id);
    return {
      photos: found?.photos || [],
      documents: found?.documents || [],
    };
  },

  async saveEvent(event: Omit<EventItem, "id"> & { id?: string }): Promise<EventItem> {
    const processedEvent = { ...event };

    // Process cover if it's an external url
    if (event.cover) {
      processedEvent.cover = await ensureCompressedSupabaseUrl(
        event.cover,
        this.uploadEventPoster.bind(this),
      );
    }

    // Process photos if there are any external urls
    if (event.photos && event.photos.length > 0) {
      processedEvent.photos = await Promise.all(
        event.photos.map((p) => ensureCompressedSupabaseUrl(p, this.uploadEventPoster.bind(this))),
      );
    }

    // Process documents if there are any external urls
    if (event.documents && event.documents.length > 0) {
      processedEvent.documents = await Promise.all(
        event.documents.map(async (doc) => {
          if (doc.url) {
            const uploadedUrl = await ensureCompressedDocumentSupabaseUrl(
              doc.url,
              this.uploadEventDocument.bind(this),
            );
            return { ...doc, url: uploadedUrl };
          }
          return doc;
        }),
      );
    }

    if (supabase) {
      const dbRow = mapEventToDB(processedEvent);
      if (event.id) {
        // Update
        const { data, error } = await supabase
          .from("events")
          .update(dbRow)
          .eq("id", event.id)
          .select()
          .single();
        if (error) {
          console.error("Error updating event in Supabase:", error);
          throw new Error(error.message);
        }
        return mapEventFromDB(data);
      } else {
        // Insert
        const { data, error } = await supabase.from("events").insert(dbRow).select().single();
        if (error) {
          console.error("Error inserting event in Supabase:", error);
          throw new Error(error.message);
        }
        return mapEventFromDB(data);
      }
    }

    // Fallback to localStorage
    const list = await this.getEvents();
    const id = event.id || `event-${Date.now()}`;
    const newEvent: EventItem = {
      ...processedEvent,
      id,
      rules: processedEvent.rules || [],
      schedule: processedEvent.schedule || [],
      photos: processedEvent.photos || [],
      documents: processedEvent.documents || [],
    };

    const index = list.findIndex((e) => e.id === id);
    if (index >= 0) {
      list[index] = newEvent;
    } else {
      list.push(newEvent);
    }
    setLocalData(KEYS.EVENTS, list);
    return newEvent;
  },

  async deleteEvent(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) {
        console.error("Error deleting event from Supabase:", error);
        throw new Error(error.message);
      }
      return;
    }

    const list = await this.getEvents();
    const filtered = list.filter((e) => e.id !== id);
    setLocalData(KEYS.EVENTS, filtered);
  },

  async toggleProblemStatementLock(id: string): Promise<EventItem | undefined> {
    if (supabase) {
      const event = await this.getEventById(id);
      if (event) {
        const { data, error } = await supabase
          .from("events")
          .update({ problem_statement_locked: !event.problemStatementLocked })
          .eq("id", id)
          .select()
          .single();
        if (error) {
          console.error("Error toggling event lock in Supabase:", error);
          throw new Error(error.message);
        }
        return mapEventFromDB(data);
      }
    }

    const list = await this.getEvents();
    const index = list.findIndex((e) => e.id === id);
    if (index >= 0) {
      list[index].problemStatementLocked = !list[index].problemStatementLocked;
      setLocalData(KEYS.EVENTS, list);
      return list[index];
    }
    return undefined;
  },

  // --- Announcements ---
  async getAnnouncements(): Promise<AnnouncementItem[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("date", { ascending: false });
      if (!error && data) return data;
      console.error("Error fetching announcements from Supabase:", error);
    }
    return getLocalData<AnnouncementItem>(KEYS.ANNOUNCEMENTS, ANNOUNCEMENTS);
  },

  async saveAnnouncement(
    announcement: Omit<AnnouncementItem, "id" | "date"> & { id?: string; date?: string },
  ): Promise<AnnouncementItem> {
    if (supabase) {
      const dbRow = {
        title: announcement.title,
        body: announcement.body,
        date: announcement.date || new Date().toISOString().split("T")[0],
      };
      if (announcement.id) {
        const { data, error } = await supabase
          .from("announcements")
          .update(dbRow)
          .eq("id", announcement.id)
          .select()
          .single();
        if (error) {
          console.error("Error updating announcement in Supabase:", error);
          throw new Error(error.message);
        }
        return data;
      } else {
        const { data, error } = await supabase
          .from("announcements")
          .insert(dbRow)
          .select()
          .single();
        if (error) {
          console.error("Error inserting announcement in Supabase:", error);
          throw new Error(error.message);
        }
        return data;
      }
    }

    const list = await this.getAnnouncements();
    const id = announcement.id || `ann-${Date.now()}`;
    const date = announcement.date || new Date().toISOString().split("T")[0];
    const newAnn: AnnouncementItem = { ...announcement, id, date };

    const index = list.findIndex((a) => a.id === id);
    if (index >= 0) {
      list[index] = newAnn;
    } else {
      list.unshift(newAnn);
    }
    setLocalData(KEYS.ANNOUNCEMENTS, list);
    return newAnn;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) {
        console.error("Error deleting announcement from Supabase:", error);
        throw new Error(error.message);
      }
      return;
    }

    const list = await this.getAnnouncements();
    const filtered = list.filter((a) => a.id !== id);
    setLocalData(KEYS.ANNOUNCEMENTS, filtered);
  },

  // --- Team ---
  async uploadTeamPhoto(file: File): Promise<string> {
    if (supabase) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage.from("team-photos").upload(filePath, file, {
        cacheControl: "31536000",
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

      if (error) {
        console.error("Error uploading team photo to Supabase:", error);
        throw new Error(error.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("team-photos").getPublicUrl(filePath);

      return publicUrl;
    }
    throw new Error("Supabase is not configured for uploads");
  },

  async uploadEventPoster(file: File): Promise<string> {
    if (supabase) {
      const fileExt = file.name.split(".").pop();
      const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage.from("team-photos").upload(filePath, file, {
        cacheControl: "31536000",
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

      if (error) {
        console.error("Error uploading event poster to Supabase:", error);
        throw new Error(error.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("team-photos").getPublicUrl(filePath);

      return publicUrl;
    }
    throw new Error("Supabase is not configured for uploads");
  },

  async uploadEventDocument(file: File): Promise<string> {
    if (supabase) {
      const fileExt = file.name.split(".").pop();
      const fileName = `doc-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { file: processedFile, isCompressed } = await compressDocument(file);

      const uploadOptions: {
        contentType?: string;
        contentEncoding?: string;
        cacheControl?: string;
        upsert?: boolean;
      } = {
        contentType: file.type || "application/octet-stream",
        cacheControl: "31536000", // Cache documents for 1 year
        upsert: false,
      };

      if (isCompressed) {
        uploadOptions.contentEncoding = "gzip";
      }

      const { data, error } = await supabase.storage
        .from("team-photos")
        .upload(filePath, processedFile, uploadOptions);

      if (error) {
        console.error("Error uploading document to Supabase:", error);
        throw new Error(error.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("team-photos").getPublicUrl(filePath);

      return publicUrl;
    }
    throw new Error("Supabase is not configured for uploads");
  },

  async getTeam(): Promise<TeamMember[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("team")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) return data.map(mapTeamFromDB);
      console.error("Error fetching team from Supabase:", error);
    }
    return getLocalData<TeamMember>(KEYS.TEAM, TEAM);
  },

  async saveTeamMember(member: Omit<TeamMember, "id"> & { id?: string }): Promise<TeamMember> {
    const processedMember = { ...member };
    if (member.photoUrl) {
      processedMember.photoUrl = await ensureCompressedSupabaseUrl(
        member.photoUrl,
        this.uploadTeamPhoto.bind(this),
      );
    }

    if (supabase) {
      const dbRow = mapTeamToDB(processedMember);
      if (member.id) {
        const { data, error } = await supabase
          .from("team")
          .update(dbRow)
          .eq("id", member.id)
          .select()
          .single();
        if (error) {
          console.error("Error updating team member in Supabase:", error);
          throw new Error(error.message);
        }
        return mapTeamFromDB(data);
      } else {
        const { data, error } = await supabase.from("team").insert(dbRow).select().single();
        if (error) {
          console.error("Error inserting team member in Supabase:", error);
          throw new Error(error.message);
        }
        return mapTeamFromDB(data);
      }
    }

    const list = await this.getTeam();
    const id = member.id || `team-${Date.now()}`;
    const newMember: TeamMember = { ...processedMember, id };

    const index = list.findIndex((m) => m.id === id);
    if (index >= 0) {
      list[index] = newMember;
    } else {
      list.push(newMember);
    }
    setLocalData(KEYS.TEAM, list);
    return newMember;
  },

  async deleteTeamMember(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from("team").delete().eq("id", id);
      if (error) {
        console.error("Error deleting team member from Supabase:", error);
        throw new Error(error.message);
      }
      return;
    }

    const list = await this.getTeam();
    const filtered = list.filter((m) => m.id !== id);
    setLocalData(KEYS.TEAM, filtered);
  },

  // --- Registrations ---
  async getRegistrations(): Promise<RegistrationItem[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("registered_at", { ascending: false });
      if (!error && data) {
        return data.map((r: any) => ({
          id: r.id,
          eventId: r.event_id,
          name: r.name,
          regNumber: r.reg_number,
          email: r.email,
          contact: r.contact,
          paymentScreenshotUrl: r.payment_screenshot_url || undefined,
          registeredAt: r.registered_at,
        }));
      }
      console.error("Error fetching registrations from Supabase:", error);
    }
    return getLocalData<RegistrationItem>(KEYS.REGISTRATIONS, []);
  },

  async getRegistrationsByEvent(eventId: string): Promise<RegistrationItem[]> {
    const list = await this.getRegistrations();
    return list.filter((r) => r.eventId === eventId);
  },

  async addRegistration(
    reg: Omit<RegistrationItem, "id" | "registeredAt">,
  ): Promise<RegistrationItem> {
    if (supabase) {
      const { error } = await supabase.from("registrations").insert({
        event_id: reg.eventId,
        name: reg.name,
        reg_number: reg.regNumber,
        email: reg.email,
        contact: reg.contact,
        payment_screenshot_url: reg.paymentScreenshotUrl,
      });
      if (error) {
        console.error("Error adding registration in Supabase:", error);
        throw new Error(error.message);
      }
      return {
        id: `reg-${Date.now()}`,
        eventId: reg.eventId,
        name: reg.name,
        regNumber: reg.regNumber,
        email: reg.email,
        contact: reg.contact,
        paymentScreenshotUrl: reg.paymentScreenshotUrl,
        registeredAt: new Date().toISOString(),
      };
    }

    const list = await this.getRegistrations();
    const newReg: RegistrationItem = {
      ...reg,
      id: `reg-${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    list.unshift(newReg);
    setLocalData(KEYS.REGISTRATIONS, list);
    return newReg;
  },

  // --- Sponsors ---
  async getSponsorInquiries(): Promise<SponsorInquiryItem[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("submitted_at", { ascending: false });
      if (!error && data) {
        return data.map((s: any) => ({
          id: s.id,
          org: s.org,
          contact: s.contact,
          email: s.email,
          phone: s.phone,
          message: s.message,
          submittedAt: s.submitted_at,
        }));
      }
      console.error("Error fetching sponsors from Supabase:", error);
    }
    return getLocalData<SponsorInquiryItem>(KEYS.SPONSORS, []);
  },

  async addSponsorInquiry(
    inquiry: Omit<SponsorInquiryItem, "id" | "submittedAt">,
  ): Promise<SponsorInquiryItem> {
    if (supabase) {
      const { error } = await supabase.from("sponsors").insert({
        org: inquiry.org,
        contact: inquiry.contact,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
      });
      if (error) {
        console.error("Error adding sponsor inquiry in Supabase:", error);
        throw new Error(error.message);
      }
      return {
        ...inquiry,
        id: `sp-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };
    }

    const list = await this.getSponsorInquiries();
    const newInquiry: SponsorInquiryItem = {
      ...inquiry,
      id: `sp-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    list.unshift(newInquiry);
    setLocalData(KEYS.SPONSORS, list);
    return newInquiry;
  },

  // --- Contact submissions ---
  async getContactSubmissions(): Promise<ContactItem[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("submitted_at", { ascending: false });
      if (!error && data) {
        return data.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          message: c.message,
          submittedAt: c.submitted_at,
          read: c.read,
        }));
      }
      console.error("Error fetching contacts from Supabase:", error);
    }
    return getLocalData<ContactItem>(KEYS.CONTACTS, []);
  },

  async addContactSubmission(
    submission: Omit<ContactItem, "id" | "submittedAt">,
  ): Promise<ContactItem> {
    if (supabase) {
      const { error } = await supabase.from("contacts").insert({
        name: submission.name,
        email: submission.email,
        message: submission.message,
      });
      if (error) {
        console.error("Error adding contact submission in Supabase:", error);
        throw new Error(error.message);
      }
      return {
        ...submission,
        id: `c-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        read: false,
      };
    }

    const list = await this.getContactSubmissions();
    const newSub: ContactItem = {
      ...submission,
      id: `c-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      read: false,
    };
    list.unshift(newSub);
    setLocalData(KEYS.CONTACTS, list);
    return newSub;
  },

  async toggleContactSubmissionRead(id: string): Promise<ContactItem | undefined> {
    if (supabase) {
      const contacts = await this.getContactSubmissions();
      const current = contacts.find((c) => c.id === id);
      if (current) {
        const { data, error } = await supabase
          .from("contacts")
          .update({ read: !current.read })
          .eq("id", id)
          .select()
          .single();
        if (error) {
          console.error("Error toggling contact read state in Supabase:", error);
          throw new Error(error.message);
        }
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          message: data.message,
          submittedAt: data.submitted_at,
          read: data.read,
        };
      }
    }

    const list = await this.getContactSubmissions();
    const index = list.findIndex((c) => c.id === id);
    if (index >= 0) {
      list[index].read = !list[index].read;
      setLocalData(KEYS.CONTACTS, list);
      return list[index];
    }
    return undefined;
  },

  // --- Join Us submissions ---
  async getJoinSubmissions(): Promise<JoinSubmission[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("joiners")
        .select("*")
        .order("submitted_at", { ascending: false });
      if (!error && data) {
        return data.map((j: any) => ({
          id: j.id,
          name: j.name,
          regNumber: j.reg_number,
          email: j.email,
          mobile: j.mobile,
          year: j.year,
          domain: j.domain,
          why: j.why || undefined,
          status: j.status,
          submittedAt: j.submitted_at,
        }));
      }
      console.error("Error fetching joiners from Supabase:", error);
    }
    return getLocalData<JoinSubmission>(KEYS.JOINERS, []);
  },

  async addJoinSubmission(
    submission: Omit<JoinSubmission, "id" | "submittedAt" | "status">,
  ): Promise<JoinSubmission> {
    if (supabase) {
      const { error } = await supabase.from("joiners").insert({
        name: submission.name,
        reg_number: submission.regNumber,
        email: submission.email,
        mobile: submission.mobile,
        year: submission.year,
        domain: submission.domain,
        why: submission.why,
      });
      if (error) {
        console.error("Error adding join submission in Supabase:", error);
        throw new Error(error.message);
      }
      return {
        ...submission,
        id: `js-${Date.now()}`,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };
    }

    const list = await this.getJoinSubmissions();
    const newSub: JoinSubmission = {
      ...submission,
      id: `js-${Date.now()}`,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };
    list.unshift(newSub);
    setLocalData(KEYS.JOINERS, list);
    return newSub;
  },

  async updateJoinSubmissionStatus(
    id: string,
    status: JoinSubmission["status"],
  ): Promise<JoinSubmission | undefined> {
    if (supabase) {
      const { data, error } = await supabase
        .from("joiners")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Error updating joiner status in Supabase:", error);
        throw new Error(error.message);
      }
      return {
        id: data.id,
        name: data.name,
        regNumber: data.reg_number,
        email: data.email,
        mobile: data.mobile,
        year: data.year,
        domain: data.domain,
        why: data.why || undefined,
        status: data.status,
        submittedAt: data.submitted_at,
      };
    }

    const list = await this.getJoinSubmissions();
    const index = list.findIndex((js) => js.id === id);
    if (index >= 0) {
      list[index].status = status;
      setLocalData(KEYS.JOINERS, list);
      return list[index];
    }
    return undefined;
  },

  async deleteJoinSubmission(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from("joiners").delete().eq("id", id);
      if (error) {
        console.error("Error deleting joiner from Supabase:", error);
        throw new Error(error.message);
      }
      return;
    }

    const list = await this.getJoinSubmissions();
    const filtered = list.filter((js) => js.id !== id);
    setLocalData(KEYS.JOINERS, filtered);
  },

  // --- Recruitment Open settings ---
  async getRecruitmentOpen(): Promise<boolean> {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(KEYS.RECRUITMENT_OPEN);
    if (stored === null) {
      localStorage.setItem(KEYS.RECRUITMENT_OPEN, "true");
      return true;
    }
    return stored === "true";
  },

  async setRecruitmentOpen(isOpen: boolean): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.RECRUITMENT_OPEN, isOpen ? "true" : "false");
    }
  },

  // --- Stats Aggregator ---
  async getStats() {
    const events = await this.getEvents();
    const announcements = await this.getAnnouncements();
    const team = await this.getTeam();
    const registrations = await this.getRegistrations();
    const sponsors = await this.getSponsorInquiries();
    const joiners = await this.getJoinSubmissions();

    return {
      upcomingEvents: events.filter((e) => e.status === "upcoming").length,
      activeAnnouncements: announcements.length,
      teamMembers: team.length,
      totalRegistrations: registrations.length,
      totalSponsors: sponsors.length,
      totalJoiners: joiners.length,
    };
  },
};
