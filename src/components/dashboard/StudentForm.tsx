'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { studentSchema, type StudentFormValues } from '@/lib/schema';
import type { Student } from '@/lib/definitions';
import { addStudent, updateStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePicker } from './DatePicker';
import { Textarea } from '@/components/ui/textarea';

interface StudentFormProps {
  student?: Student;
}

export function StudentForm({ student }: StudentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      vaccine: undefined,
      newEnrolReEnrol: undefined,
      progress: undefined,
      conduct: undefined,
      disability: 'None',
    },
  });

  async function onSubmit(values: StudentFormValues) {
    setIsSubmitting(true);
    const result = student ? await updateStudent(student.id, values) : await addStudent(values);

    if (result.success) {
      toast({ title: 'Success', description: result.success });
      router.push('/dashboard');
      router.refresh();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="studentName" render={({ field }) => (
                  <FormItem><FormLabel>Student Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fatherName" render={({ field }) => (
                  <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="religion" render={({ field }) => (
                  <FormItem><FormLabel>Religion</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="caste" render={({ field }) => (
                  <FormItem><FormLabel>Caste</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bForm" render={({ field }) => (
                  <FormItem><FormLabel>B. Form #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cnic" render={({ field }) => (
                  <FormItem><FormLabel>Student CNIC # (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="disability" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Disability if any</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="vaccine" render={({ field }) => (
                  <FormItem><FormLabel>Vaccinated</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="guardianName" render={({ field }) => (
                  <FormItem><FormLabel>Guardian Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="relationshipWithGuardian" render={({ field }) => (
                  <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="guardianCnic" render={({ field }) => (
                  <FormItem><FormLabel>Guardian CNIC #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contactNo" render={({ field }) => (
                  <FormItem><FormLabel>Contact No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Leaving Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="dateOfLeaving" render={({ field }) => (
                  <FormItem><FormLabel>Date of Leaving (Optional)</FormLabel><FormControl><DatePicker value={field.value || undefined} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="reasonOfLeaving" render={({ field }) => (
                  <FormItem><FormLabel>Reason for Leaving (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="remarks" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Remarks (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <FormField control={form.control} name="grNo" render={({ field }) => (
                  <FormItem><FormLabel>G.R No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="admissionDate" render={({ field }) => (
                  <FormItem><FormLabel>Admission Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="classStudying" render={({ field }) => (
                  <FormItem><FormLabel>Class</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="section" render={({ field }) => (
                  <FormItem><FormLabel>Section</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="newEnrolReEnrol" render={({ field }) => (
                  <FormItem><FormLabel>Enrollment Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="New Enrol">New Enrol</SelectItem><SelectItem value="Re-Enrol">Re-Enrol</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="progress" render={({ field }) => (
                  <FormItem><FormLabel>Progress</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select progress" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Excellent">Excellent</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Average">Average</SelectItem><SelectItem value="Poor">Poor</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="conduct" render={({ field }) => (
                  <FormItem><FormLabel>Conduct</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select conduct" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Excellent">Excellent</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Average">Average</SelectItem><SelectItem value="Poor">Poor</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="grade" render={({ field }) => (
                  <FormItem><FormLabel>Grade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {student ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
