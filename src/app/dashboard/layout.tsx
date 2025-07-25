import { AppSidebar } from '@/components/dashboard/AppSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar>
      <main className="flex-1 bg-background">{children}</main>
    </AppSidebar>
  );
}
