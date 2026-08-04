"use client";

import { useState } from "react";
import {
  Building2,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

import { api } from "@/trpc/react";

// ─── Role config ─────────────────────────────────────────────────────────────

const ROLES = ["owner", "admin", "member", "customer"] as const;
type OrgRole = (typeof ROLES)[number];

const roleConfig: Record<
  OrgRole,
  { label: string; color: string; icon: React.ReactNode }
> = {
  owner: {
    label: "Owner",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <ShieldAlert className="h-3 w-3" />,
  },
  admin: {
    label: "Admin",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <ShieldCheck className="h-3 w-3" />,
  },
  member: {
    label: "Member",
    color: "bg-teal-100 text-teal-800 border-teal-200",
    icon: <Shield className="h-3 w-3" />,
  },
  customer: {
    label: "Customer",
    color: "bg-sky-100 text-sky-800 border-sky-200",
    icon: <UserCheck className="h-3 w-3" />,
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const utils = api.useUtils();

  const { data: org } = api.org.getOrg.useQuery();
  const {
    data: users,
    isLoading,
    isRefetching,
  } = api.org.listUsers.useQuery();

  const setRoleMutation = api.org.setMemberRole.useMutation({
    onSuccess: async () => {
      await utils.org.listUsers.invalidate();
      setPendingUserId(null);
    },
    onError: (err) => {
      alert(err.message);
      setPendingUserId(null);
    },
  });

  const removeMutation = api.org.removeMember.useMutation({
    onSuccess: async () => {
      await utils.org.listUsers.invalidate();
    },
  });

  const handleRoleChange = (userId: string, role: OrgRole) => {
    setPendingUserId(userId);
    setRoleMutation.mutate({ userId, role });
  };

  const handleRemove = (userId: string, name: string) => {
    if (confirm(`Remove ${name} from the organization?`)) {
      removeMutation.mutate({ userId });
    }
  };

  const filtered = users?.filter(
    (u) =>
      !search ||
      (u.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (u.email.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-[var(--navy)]">
            <Users className="h-7 w-7 text-[var(--teal)]" />
            Users &amp; Roles
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Manage users and their roles in the Limitless Legacy organization.
          </p>
        </div>

        {/* Org status pill */}
        {org ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800">
            <Building2 className="h-4 w-4" />
            <span>{org.name}</span>
            <span className="font-mono text-[10px] font-semibold text-emerald-600">
              /{org.slug}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800">
            <ShieldOff className="h-4 w-4" />
            Organization not seeded — run{" "}
            <code className="font-mono">pnpm db:seed</code>
          </div>
        )}
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-2">
        {ROLES.map((role) => {
          const cfg = roleConfig[role];
          return (
            <span
              key={role}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${cfg.color}`}
            >
              {cfg.icon}
              {cfg.label}
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(18,58,90,0.15)] bg-[rgba(18,58,90,0.04)] px-3 py-1 text-[11px] font-bold text-[rgba(23,50,74,0.5)]">
          <ShieldOff className="h-3 w-3" />
          Not a member
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(18,58,90,0.4)]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0]/60 py-2 pl-9 pr-3 text-xs font-medium text-[var(--navy)] focus:border-[var(--teal)] focus:bg-white focus:outline-none"
          />
        </div>
        <button
          onClick={() => void utils.org.listUsers.invalidate()}
          disabled={isRefetching}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] px-3 py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[rgba(18,58,90,0.08)] bg-[#FAF7F0] font-extrabold uppercase tracking-wider text-[var(--navy)]">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Org Role</th>
              <th className="p-4">Change Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(18,58,90,0.06)] font-semibold text-[var(--ink)]">
            {isLoading &&
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5].map((j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-[rgba(18,58,90,0.07)]" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && filtered?.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-[rgba(23,50,74,0.5)]"
                >
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              filtered?.map((u) => {
                const roleCfg = u.orgRole ? roleConfig[u.orgRole] : null;
                const isPending = pendingUserId === u.id;
                const joined = new Date(u.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );

                return (
                  <tr
                    key={u.id}
                    className="transition hover:bg-[rgba(18,58,90,0.02)]"
                  >
                    {/* User info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-black text-white">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--navy)]">
                            {u.name}
                          </span>
                          <span className="text-[10px] text-[rgba(23,50,74,0.6)]">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Joined date */}
                    <td className="p-4 text-[rgba(23,50,74,0.7)]">{joined}</td>

                    {/* Current role badge */}
                    <td className="p-4">
                      {roleCfg ? (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${roleCfg.color}`}
                        >
                          {roleCfg.icon}
                          {roleCfg.label}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(18,58,90,0.1)] bg-[rgba(18,58,90,0.04)] px-2.5 py-1 text-[11px] font-semibold text-[rgba(23,50,74,0.45)]">
                          <ShieldOff className="h-3 w-3" />
                          Not a member
                        </span>
                      )}
                    </td>

                    {/* Role select */}
                    <td className="p-4">
                      <select
                        value={u.orgRole ?? ""}
                        disabled={isPending}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) handleRoleChange(u.id, val as OrgRole);
                        }}
                        className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-white px-2.5 py-1.5 text-xs font-bold text-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--teal)] disabled:opacity-50"
                      >
                        <option value="" disabled>
                          — assign role —
                        </option>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {roleConfig[r].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      {u.orgRole ? (
                        <button
                          onClick={() => handleRemove(u.id, u.name)}
                          disabled={removeMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          title="Remove from organization"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      ) : (
                        <span className="text-[10px] text-[rgba(23,50,74,0.35)]">
                          Not in org
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!isLoading && filtered && (
        <p className="text-xs font-medium text-[rgba(23,50,74,0.5)]">
          Showing {filtered.length} of {users?.length ?? 0} users
        </p>
      )}
    </div>
  );
}
