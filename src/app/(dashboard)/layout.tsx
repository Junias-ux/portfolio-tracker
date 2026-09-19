import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-6 py-8 sm:px-10 sm:py-10 max-w-[1000px]">{children}</main>
    </div>
  );
}
