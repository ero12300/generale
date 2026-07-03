import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { TopBar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-0">
        <TopBar />
        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>
      <MobileNav />
    </div>
  );
}
