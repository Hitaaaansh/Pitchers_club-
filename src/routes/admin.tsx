import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  Users,
  HandCoins,
  LogOut,
  Lock,
  UserCheck,
  Mail,
} from "lucide-react";
import logoImg from "@/assets/img/website logo-Photoroom.png";
import { supabase } from "@/lib/db";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const STORAGE_KEY = "pitchers_admin_auth";

function AdminLayout() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) {
      const mockSession = sessionStorage.getItem(STORAGE_KEY);
      setAuthed(mockSession === "1");
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] text-[#A0A0A0]">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading Admin Session...
        </div>
      </div>
    );
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  const navItems: { to: string; label: string; icon: any; exact?: boolean }[] = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/events", label: "Events", icon: Calendar },
    { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { to: "/admin/team", label: "Team", icon: Users },
    { to: "/admin/joiners", label: "Joiners", icon: UserCheck },
    { to: "/admin/contact", label: "Contact", icon: Mail },
    { to: "/admin/sponsors", label: "Sponsor Inquiries", icon: HandCoins },
  ];

  return (
    <div className="dark flex min-h-screen bg-[#0F0F0F] text-[#A0A0A0]">
      <aside className="hidden w-64 flex-col border-r border-[#2A2A2A] bg-[#1A1A1A] p-5 md:flex">
        <Link to="/" className="group mb-1">
          <img src={logoImg} alt="Pitchers Club" className="h-10 w-auto object-contain" />
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-[#E8A020] font-semibold">
          Admin Portal
        </p>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-crimson text-white shadow-[0_0_15px_rgba(165,0,0,0.4)]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <n.icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={async () => {
            if (supabase) {
              await supabase.auth.signOut();
            } else {
              sessionStorage.removeItem(STORAGE_KEY);
              setAuthed(false);
            }
            navigate({ to: "/" });
          }}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 bg-[#0F0F0F]">
        <Outlet />
      </main>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (supabase) {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        onSuccess();
      }
    } else {
      setLoading(false);
      if (email === "admin@pitchers.muj" && password === "pitchers2026") {
        sessionStorage.setItem(STORAGE_KEY, "1");
        onSuccess();
      } else {
        setError("Invalid credentials. (Demo: admin@pitchers.muj / pitchers2026)");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] p-5 text-white/80">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <Lock className="text-[#E8A020]" />
          <h1 className="text-2xl text-white font-display uppercase tracking-wide">
            Admin sign in
          </h1>
        </div>
        <p className="mt-2 text-xs text-white/60">Pitchers Club team access only.</p>
        <div className="mt-6 space-y-3">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E8A020] transition-all"
          />
          {error && <p className="text-xs text-crimson font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
