'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Pencil, Trash2, FileText, Download, FileSpreadsheet, File } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { Student } from '@/lib/definitions';
import { deleteStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

function downloadAsCSV(data: Student[], filename: string) {
    if (!data || data.length === 0) {
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), 
        ...data.map(row => 
            headers.map(fieldName => 
                JSON.stringify(row[fieldName as keyof Student], (key, value) => value === null ? '' : value)
            ).join(',')
        )
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function StudentTable({ students }: { students: Student[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  const handleDelete = async () => {
    if (selectedStudentId) {
      const result = await deleteStudent(selectedStudentId);
      if (result.success) {
        toast({ title: 'Success', description: result.success });
        router.refresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
      setIsDeleteDialogOpen(false);
      setSelectedStudentId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setSelectedStudentId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="mb-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => downloadAsCSV(students, 'students.csv')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Export to Excel (CSV)
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <File className="mr-2 h-4 w-4" /> Export to PDF
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>G.R No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Father's Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Contact No.</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.grNo}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.fatherName}</TableCell>
                  <TableCell>{student.classStudying}-{student.section}</TableCell>
                  <TableCell>{student.contactNo}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/edit-student/${student.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                          <Link href={`/dashboard/generate-certificate/${student.id}`}>
                            <FileText className="mr-2 h-4 w-4" /> Generate Certificate
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(student.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student's record from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
