'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Home, PlusCircle, User, LogOut, PanelLeft, PanelRight } from 'lucide-react';
import {SchoolLogo} from './SchoolLogo';

const navItems = [
  { href: '/dashboard', label: 'Students', icon: Home },
  { href: '/dashboard/add-student', label: 'Add Student', icon: PlusCircle },
  { href: '/dashboard/generate-certificates', label: 'Generate Certificates', icon: FileText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        'relative h-full bg-card border-r flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
        <div className="flex h-16 shrink-0 items-center px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
                 <SchoolLogo />
                <span className={cn("text-xl font-semibold", isCollapsed && "hidden")}>CampusFlow</span>
            </Link>
        </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              pathname === item.href && 'bg-muted text-primary',
              isCollapsed && 'justify-center'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className={cn('font-medium', isCollapsed && 'sr-only')}>{item.label}</span>
          </Link>
        ))}
      </nav>

        <div className="mt-auto flex flex-col gap-y-2 border-t p-4">
            <div className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground', isCollapsed && 'justify-center')}>
                <User className="h-5 w-5" />
                <span className={cn('font-medium', isCollapsed && 'sr-only')}>Admin</span>
            </div>
            <Link
                href="/login"
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', isCollapsed && 'justify-center')}>
                <LogOut className="h-5 w-5" />
                <span className={cn('font-medium', isCollapsed && 'sr-only')}>Logout</span>
            </Link>
            <Separator className="my-1"/>
            <Button
                variant="ghost"
                onClick={toggleSidebar}
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', isCollapsed && 'justify-center')}
            >
                {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                <span className={cn('font-medium', isCollapsed && 'sr-only')}>Collapse</span>
            </Button>
        </div>
    </div>
  );
}
