import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "@/components/ui/footer-section";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/lib/db";

export function SiteLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    // If navigating to a main/public website page (non-admin), force signout
    if (!path.startsWith("/admin")) {
      const handleNavigationLogout = async () => {
        if (supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            console.log("[Admin Security] Navigated to public page. Signing out from Supabase...");
            await supabase.auth.signOut();
          }
        }

        // Clear local mock session fallback
        if (sessionStorage.getItem("pitchers_admin_auth")) {
          console.log("[Admin Security] Navigated to public page. Clearing mock admin auth...");
          sessionStorage.removeItem("pitchers_admin_auth");
        }
      };

      handleNavigationLogout();
    }
  }, [path]);

  const hasHero =
    path === "/" ||
    path === "/about" ||
    path === "/events" ||
    path === "/events/" ||
    path === "/team" ||
    path === "/join" ||
    path === "/sponsor" ||
    path === "/contact" ||
    path.startsWith("/events/");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 ${hasHero ? "" : "pt-24 md:pt-28"}`}>{children}</main>
      <Footer />
    </div>
  );
}
