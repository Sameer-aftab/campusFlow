'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Home, PlusCircle, User } from 'lucide-react';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Students', icon: Home },
    { href: '/dashboard/add-student', label: 'Add Student', icon: PlusCircle },
    { href: '/dashboard/generate-certificates', label: 'Generate Certificates', icon: FileText },
  ];

  return (
    <aside className="w-64 flex-col border-r bg-card text-card-foreground hidden md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>CampusFlow</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname.startsWith(item.href) && item.href !== '/dashboard' || pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
       <div className="mt-auto p-4">
        <Separator className="my-2"/>
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-3 h-4 w-4" />
          Admin
        </Button>
      </div>
    </aside>
  );
}
