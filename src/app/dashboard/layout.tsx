import { AppSidebar } from '@/components/dashboard/AppSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  );
}
