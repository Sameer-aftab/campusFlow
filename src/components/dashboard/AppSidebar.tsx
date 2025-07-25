'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { BookOpen, FileText, Home, PlusCircle, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Students', icon: Home, tooltip: 'Students' },
    { href: '/dashboard/add-student', label: 'Add Student', icon: PlusCircle, tooltip: 'Add Student' },
    { href: '/dashboard/generate-certificates', label: 'Generate Certificates', icon: FileText, tooltip: 'Generate Certificates' },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="h-16 justify-center data-[collapsible=icon]:h-14">
          <Link href="/dashboard">
            <SidebarMenuButton
              tooltip={{ children: 'CampusFlow', side: 'right' }}
              className="!h-10 !w-10 [&>span]:hidden"
            >
              <BookOpen className="text-primary" />
              <span className="text-lg font-semibold">CampusFlow</span>
            </SidebarMenuButton>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{ children: item.tooltip, side: 'right' }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
             <Separator className="mb-2" />
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{ children: 'Admin', side: 'right' }}>
                        <User />
                        <span>Admin</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <Link href="/login">
                        <SidebarMenuButton tooltip={{ children: 'Logout', side: 'right' }}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 md:justify-end">
            <SidebarTrigger className="md:hidden"/>
            {/* Header Content can go here if needed */}
        </header>
        {children}
      </div>
    </SidebarProvider>
  );
}
