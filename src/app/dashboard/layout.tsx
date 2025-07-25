import { AppSidebar } from '@/components/dashboard/AppSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
          {children}
      </main>
    </div>
  );
}
