import { AppSidebar } from '@/components/dashboard/AppSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
          {children}
      </main>
    </div>
  );
}
