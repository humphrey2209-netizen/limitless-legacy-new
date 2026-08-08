"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  FileText,
  FolderKanban,
  History,
  LayoutDashboard,
  Lock,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/server/better-auth/client";

// ─── Nav item definitions ────────────────────────────────────────────────────

/** Visible to all authenticated users */
const openNavItems = [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics & Reports",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Parent Assessment",
    url: "/admin/assessment",
    icon: ClipboardList,
  },
];

/** Admin-only sections */
const adminNavItems = [
  {
    title: "Site Content",
    url: "/admin/content",
    icon: FileText,
  },
  {
    title: "Packages & Pricing",
    url: "/admin/packages",
    icon: Package,
  },
  {
    title: "Resource Library",
    url: "/admin/resources",
    icon: FolderKanban,
  },
  {
    title: "Users & Accounts",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings & Keys",
    url: "/admin/settings",
    icon: Settings,
  },
];

const systemNavItems = [
  {
    title: "Legacy Admin Editor",
    url: "/legacy-admin",
    icon: History,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  function NavItem({
    item,
  }: {
    item: { title: string; url: string; icon: React.ElementType };
  }) {
    const isActive =
      item.url === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.url);
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          className={
            isActive
              ? "bg-[rgba(79,175,168,0.15)] font-bold text-[var(--navy)]"
              : "font-semibold text-[var(--ink)] hover:bg-[rgba(248,244,235,0.8)]"
          }
        >
          <Link href={item.url} className="flex w-full items-center gap-2.5">
            <item.icon className="h-4 w-4 text-[var(--navy)]" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Sidebar className="border-r border-[rgba(18,58,90,0.12)] bg-[#ffffff]">
      <SidebarHeader className="border-b border-[rgba(18,58,90,0.08)] px-4 py-3">
        <Link href="/" className="text-decoration-none flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Limitless Legacy Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="text-base leading-tight font-extrabold text-[var(--navy)]">
              Limitless Legacy
            </span>
            <span className="text-xs font-semibold text-[var(--teal)]">
              Admin Portal
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {/* Open to all authenticated users */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-xs font-extrabold tracking-wider text-[rgba(18,58,90,0.6)] uppercase">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {openNavItems.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin-only management sections */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="mb-1 flex items-center gap-1.5 px-2 text-xs font-extrabold tracking-wider text-[rgba(18,58,90,0.6)] uppercase">
            {isAdmin ? (
              "Administration"
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Administration
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAdmin ? (
                adminNavItems.map((item) => (
                  <NavItem key={item.url} item={item} />
                ))
              ) : (
                <li className="px-2 py-2 text-[11px] font-semibold text-[rgba(23,50,74,0.45)] italic">
                  Admin access required
                </li>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & system – admin only */}
        {isAdmin && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className="mb-1 px-2 text-xs font-extrabold tracking-wider text-[rgba(18,58,90,0.6)] uppercase">
              Tools & System
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemNavItems.map((item) => (
                  <NavItem key={item.url} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-[rgba(18,58,90,0.08)] p-3">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-[#FAF7F0] p-2.5">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-bold text-white">
              {session?.user.name
                ? session.user.name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-bold text-[var(--navy)]">
                {session?.user.name ?? "User"}
              </span>
              <span
                className="truncate text-[10px] font-medium"
                style={{
                  color: isAdmin ? "var(--teal)" : "rgba(23,50,74,0.5)",
                }}
              >
                {isAdmin ? "Administrator" : "View-only access"}
              </span>
            </div>
          </div>
          {session && (
            <button
              onClick={() => authClient.signOut()}
              className="rounded-lg p-1.5 text-[var(--navy)] transition hover:bg-[rgba(18,58,90,0.1)]"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
