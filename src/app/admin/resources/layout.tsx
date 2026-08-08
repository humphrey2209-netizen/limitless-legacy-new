import AdminGuard from "@/app/admin/_components/admin-guard";

export default function AdminResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
