'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2, Printer } from 'lucide-react';

import type { Student } from '@/lib/definitions';
import { generateCertificate, type GenerateCertificateOutput } from '@/ai/flows/generate-certificate';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

type CertificateType = 'Appearance' | 'Character' | 'Pass' | 'School Leaving';

const certificateTypes: CertificateType[] = ['Appearance', 'Character', 'Pass', 'School Leaving'];

type GeneratedCertificate = {
    studentName: string;
    certificateText: string;
}

export function BulkCertificateGenerator({ students }: { students: Student[] }) {
  const { toast } = useToast();
  const [certificateType, setCertificateType] = useState<CertificateType>('Appearance');
  const [generatedCertificates, setGeneratedCertificates] = useState<GeneratedCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  
  const uniqueClasses = useMemo(() => ['all', ...Array.from(new Set(students.map(s => s.classStudying)))], [students]);
  const uniqueSections = useMemo(() => ['all', ...Array.from(new Set(students.map(s => s.section)))], [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchMatch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const classMatch = classFilter === 'all' || student.classStudying === classFilter;
      const sectionMatch = sectionFilter === 'all' || student.section === sectionFilter;
      return searchMatch && classMatch && sectionMatch;
    });
  }, [students, searchTerm, classFilter, sectionFilter]);
  
  useEffect(() => {
    setSelectedStudents(new Set());
  }, [searchTerm, classFilter, sectionFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };
  
  const handleSelectStudent = (studentId: string, checked: boolean) => {
      const newSelection = new Set(selectedStudents);
      if(checked) {
          newSelection.add(studentId);
      } else {
          newSelection.delete(studentId);
      }
      setSelectedStudents(newSelection);
  }

  const handleGenerate = async () => {
    if (selectedStudents.size === 0) {
      toast({
        variant: 'destructive',
        title: 'No Students Selected',
        description: 'Please select at least one student to generate certificates.',
      });
      return;
    }

    setIsLoading(true);
    setShowCertificates(false);
    setGeneratedCertificates([]);

    const studentsToProcess = students.filter(s => selectedStudents.has(s.id));

    try {
      const promises = studentsToProcess.map(student => {
        const studentDataForAI = {
          ...student,
          dateOfBirth: format(new Date(student.dateOfBirth), 'yyyy-MM-dd'),
          admissionDate: format(new Date(student.admissionDate), 'yyyy-MM-dd'),
          dateOfLeaving: student.dateOfLeaving ? format(new Date(student.dateOfLeaving), 'yyyy-MM-dd') : 'N/A',
          cnic: student.cnic || 'N/A',
          remarks: student.remarks || 'N/A',
          reasonOfLeaving: student.reasonOfLeaving || 'N/A',
        };
        return generateCertificate({
          studentData: studentDataForAI,
          certificateType,
        }).then(result => ({ studentName: student.studentName, ...result }));
      });
      
      const results = await Promise.all(promises);
      setGeneratedCertificates(results);
      setShowCertificates(true);

    } catch (error) {
      console.error('Error generating certificates:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate all certificates. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 no-print">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Options</CardTitle>
            <CardDescription>Select students and a certificate type to generate in bulk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-semibold">Certificate Type</Label>
              <RadioGroup
                value={certificateType}
                onValueChange={(value: CertificateType) => setCertificateType(value)}
                className="mt-2 space-y-2"
              >
                {certificateTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`bulk-${type}`} />
                    <Label htmlFor={`bulk-${type}`} className="font-normal">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading || selectedStudents.size === 0} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating ({selectedStudents.size})...
                </>
              ) : (
                `Generate ${selectedStudents.size > 0 ? `(${selectedStudents.size})` : ''} Certificate(s)`
              )}
            </Button>
          </CardContent>
        </Card>
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Filter Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Input 
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                <div className="flex gap-2">
                <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by class" /></SelectTrigger>
                    <SelectContent>
                    {uniqueClasses.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Classes' : c}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by section" /></SelectTrigger>
                    <SelectContent>
                    {uniqueSections.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Sections' : s}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {showCertificates ? (
           <div className="space-y-4">
                {generatedCertificates.map((cert, index) => (
                    <Card key={index} className="min-h-[500px] shadow-lg printable-area">
                    <CardHeader className="items-center text-center">
                        <img src="https://placehold.co/100x100.png" alt="School Logo" className="w-24 h-24 mx-auto mb-4 rounded-full" data-ai-hint="school logo" />
                        <h2 className="text-3xl font-bold tracking-wider">CampusFlow School System</h2>
                        <p className="text-muted-foreground">Knowledge is Power</p>
                        <Separator className="my-4"/>
                        <CardTitle className="text-2xl font-bold tracking-widest uppercase text-primary pt-4">
                        {certificateType} Certificate
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-12 py-8 text-lg leading-relaxed">
                        <p>{cert.certificateText}</p>
                        
                        <div className="flex justify-between mt-24 pt-8 border-t-2 border-dashed">
                            <div className="text-center">
                                <p className="border-t-2 border-foreground pt-2">Principal's Signature</p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">Date of Issue:</p>
                                <p>{format(new Date(), 'MMMM dd, yyyy')}</p>
                            </div>
                        </div>
                    </CardContent>
                    </Card>
                ))}

                <div className="mt-4 text-right no-print">
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4"/>
                        Print All Certificates
                    </Button>
                </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
                <CardTitle>Select Students</CardTitle>
                <CardDescription>
                    Found {filteredStudents.length} students. 
                    Selected {selectedStudents.size}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead padding="checkbox">
                                <Checkbox
                                    checked={selectedStudents.size > 0 && selectedStudents.size === filteredStudents.length}
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Father's Name</TableHead>
                            <TableHead>Class</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                            <TableRow key={student.id} 
                                data-state={selectedStudents.has(student.id) && "selected"}>
                                <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedStudents.has(student.id)}
                                    onCheckedChange={(checked) => handleSelectStudent(student.id, !!checked)}
                                    aria-label="Select row"
                                />
                                </TableCell>
                                <TableCell className="font-medium">{student.studentName}</TableCell>
                                <TableCell>{student.fatherName}</TableCell>
                                <TableCell>{student.classStudying}-{student.section}</TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No students found.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
