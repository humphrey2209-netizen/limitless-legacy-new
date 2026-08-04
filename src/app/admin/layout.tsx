import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Globe } from "lucide-react";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/server/better-auth/server";
import { AdminSidebar } from "./_components/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin Portal | Limitless Legacy",
  description: "Limitless Legacy site management and content administration portal.",
};

/** Pages that any authenticated user can see (overview, analytics, assessment read) */
const PUBLIC_ADMIN_PATHS = ["/admin", "/admin/analytics", "/admin/assessment"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?redirectTo=/admin");
  }

  const isAdmin = (session.user as { role?: string }).role === "admin";

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-[#FAF7F0]">
          <AdminSidebar isAdmin={isAdmin} />
          <SidebarInset className="flex min-h-screen flex-1 flex-col bg-[#FAF7F0]">
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[rgba(18,58,90,0.1)] bg-white/90 px-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-[var(--navy)] hover:bg-[rgba(18,58,90,0.08)]" />
                <div className="h-4 w-px bg-[rgba(18,58,90,0.15)]" />
                <span className="text-sm font-bold text-[var(--navy)]">
                  Admin Dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                {!isAdmin && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    View only
                  </span>
                )}
                <Link
                  href="/"
                  className="flex items-center gap-1.5 rounded-full border border-[rgba(18,58,90,0.15)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--navy)] transition hover:bg-[rgba(79,175,168,0.12)]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  View Public Website
                  <ExternalLink className="h-3 w-3 ml-0.5" />
                </Link>
              </div>
            </header>
            <div className="flex-1 p-6">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
