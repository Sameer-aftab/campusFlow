'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { ToWords } from 'to-words';
import { format } from 'date-fns';

interface StudentFormProps {
  student?: Student;
}

const examinationOptions = [
  'Class 6',
  'Class 7',
  'Class 8',
  'S.S.C Part-I Annual',
  'S.S.C Part-II Annual',
];

const classOptions = ['6', '7', '8', '9', '10'];
const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'CADET'];

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: false,
  },
});

function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function dateToWords(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const day = date.getDate();
  const month = format(date, 'MMMM');
  const year = date.getFullYear();

  const dayInWords = capitalize(toWords.convert(day, { doNotAddOnly: true }));
  const yearInWords = capitalize(toWords.convert(year, { doNotAddOnly: true }));

  return `${dayInWords} ${month} ${yearInWords}`;
}

export function StudentForm({ student }: StudentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: student
      ? {
          ...student,
          dateOfLeaving: student.dateOfLeaving || null,
          cnic: student.cnic || '',
          sscRollNo: student.sscRollNo || '',
          remarks: student.remarks || '',
          reasonOfLeaving: student.reasonOfLeaving || '',
          underSeatNo: student.underSeatNo || '',
          妣ype: student.妣ype || undefined,
        }
      : {
          grNo: '',
          studentName: '',
          fatherName: '',
          vaccine: undefined,
          newEnrolReEnrol: undefined,
          progress: undefined,
          conduct: undefined,
          disability: 'None',
          raceAndCaste: '',
          placeOfBirth: '',
          dateOfBirthInWords: '',
          lastSchoolAttended: '',
          classInWhichAdmitted: '',
          examination: undefined,
          underSeatNo: '',
          grade: '',
          reasonOfLeaving: '',
          remarks: '',
          sscRollNo: '',
          cnic: '',
          dateOfLeaving: null,
          妣ype: undefined,
          bForm: '',
          religion: '',
          guardianName: '',
          guardianCnic: '',
          relationshipWithGuardian: '',
          contactNo: '',
          classStudying: undefined,
          section: undefined,
        },
  });

  const dateOfBirthValue = useWatch({
    control: form.control,
    name: 'dateOfBirth',
  });

  useEffect(() => {
    if (dateOfBirthValue) {
      const words = dateToWords(dateOfBirthValue);
      // Only set value if it's different to prevent re-renders
      if (form.getValues('dateOfBirthInWords') !== words.toUpperCase()) {
        form.setValue('dateOfBirthInWords', words.toUpperCase(), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [dateOfBirthValue?.getTime(), form]);


  async function onSubmit(values: StudentFormValues) {
    setIsSubmitting(true);
    const cleanedValues = {
      ...values,
      sscRollNo: values.sscRollNo || '',
      cnic: values.cnic || '',
      remarks: values.remarks || '',
      reasonOfLeaving: values.reasonOfLeaving || '',
      underSeatNo: values.underSeatNo || '',
    };

    const result = student
      ? await updateStudent(student.id, cleanedValues)
      : await addStudent(cleanedValues);

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
                  <FormItem><FormLabel>Student Name</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fatherName" render={({ field }) => (
                  <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth (in figures)</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="dateOfBirthInWords" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth (in words)</FormLabel><FormControl><Input {...field} readOnly className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="placeOfBirth" render={({ field }) => (
                  <FormItem><FormLabel>Place of Birth</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="lastSchoolAttended" render={({ field }) => (
                  <FormItem><FormLabel>Last School Attended</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="religion" render={({ field }) => (
                  <FormItem><FormLabel>Religion</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="raceAndCaste" render={({ field }) => (
                  <FormItem><FormLabel>Race and Caste</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bForm" render={({ field }) => (
                  <FormItem><FormLabel>B. Form #</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cnic" render={({ field }) => (
                  <FormItem><FormLabel>Student CNIC # (Optional)</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="disability" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Disability if any</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
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
                  <FormItem><FormLabel>Guardian Name</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="relationshipWithGuardian" render={({ field }) => (
                  <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="guardianCnic" render={({ field }) => (
                  <FormItem><FormLabel>Guardian CNIC #</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contactNo" render={({ field }) => (
                  <FormItem><FormLabel>Contact No.</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Leaving Information (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="dateOfLeaving" render={({ field }) => (
                  <FormItem><FormLabel>Date of Leaving</FormLabel><FormControl><DatePicker value={field.value || undefined} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="reasonOfLeaving" render={({ field }) => (
                  <FormItem><FormLabel>Reason for Leaving</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                  <FormField control={form.control} name="examination" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Examination Passed</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select examination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {examinationOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="underSeatNo" render={({ field }) => (
                  <FormItem><FormLabel>Under Seat No:</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="remarks" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Remarks</FormLabel><FormControl><Textarea {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
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
                  <FormItem><FormLabel>G.R No.</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="admissionDate" render={({ field }) => (
                  <FormItem><FormLabel>Admission Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="classInWhichAdmitted" render={({ field }) => (
                  <FormItem><FormLabel>Class in which admitted</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="classStudying" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class in which studying</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {classOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="section" render={({ field }) => (
                   <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {sectionOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
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
                  <FormItem><FormLabel>Grade</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>SSC Information (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="妣ype" render={({ field }) => (
                    <FormItem><FormLabel>SSC Type</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="SSC I" /></FormControl><FormLabel className="font-normal">SSC I</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="SSC II" /></FormControl><FormLabel className="font-normal">SSC II</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sscRollNo" render={({ field }) => (
                  <FormItem><FormLabel>SSC Roll No.</FormLabel><FormControl><Input {...field} className="uppercase-input" /></FormControl><FormMessage /></FormItem>
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
