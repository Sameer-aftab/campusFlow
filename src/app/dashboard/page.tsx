import Link from 'next/link';
import { getStudents } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { StudentTable } from '@/components/dashboard/StudentTable';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function DashboardPage() {
  const students = await getStudents();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-6">
        <h1 className="text-xl font-semibold">Students</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/add-student">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>View, edit, and manage all student records.</CardDescription>
          </CardHeader>
          <CardContent>
             <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <StudentTable students={students} />
             </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
