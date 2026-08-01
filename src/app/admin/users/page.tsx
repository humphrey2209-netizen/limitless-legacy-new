import { Users } from "lucide-react";

export default function AdminUsersPage() {
  const usersList = [
    {
      name: "Kelvin Admin",
      email: "hello.limitlesslegacy@gmail.com",
      role: "Administrator",
      joined: "Aug 2026",
      status: "Active",
    },
    {
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      role: "Parent Account",
      joined: "Jul 2026",
      status: "Active",
    },
    {
      name: "Marcus Vance",
      email: "m.vance@school.edu",
      role: "Educator Account",
      joined: "Jun 2026",
      status: "Active",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-2">
          <Users className="h-7 w-7 text-[var(--teal)]" /> Users & Accounts
        </h1>
        <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
          Manage system administrators, parent accounts, and authenticated sessions.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F0] border-b border-[rgba(18,58,90,0.08)] text-[var(--navy)] font-extrabold uppercase tracking-wider">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(18,58,90,0.06)] font-semibold text-[var(--ink)]">
            {usersList.map((u) => (
              <tr key={u.email} className="hover:bg-slate-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--navy)] text-white font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--navy)]">{u.name}</span>
                    <span className="text-[10px] text-[rgba(23,50,74,0.7)]">{u.email}</span>
                  </div>
                </td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">{u.joined}</td>
                <td className="p-4">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="rounded-lg border border-[rgba(18,58,90,0.15)] bg-white px-3 py-1 text-xs font-bold text-[var(--navy)] hover:bg-[rgba(18,58,90,0.05)]">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
