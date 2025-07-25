'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2, Printer } from 'lucide-react';

import type { Student, CertificateType } from '@/lib/definitions';
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
import { generateCertificateText } from '@/lib/certificate-templates';
import { certificateTypes } from '@/lib/definitions';

type GeneratedCertificate = {
    studentName: string;
    certificateText: string;
    student: Student;
}

export function BulkCertificateGenerator({ students }: { students: Student[] }) {
  const { toast } = useToast();
  const [certificateType, setCertificateType] = useState<CertificateType>('Appearance');
  const [grade, setGrade] = useState('');
  const [character, setCharacter] = useState('');
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
     if (certificateType === 'Appearance' && !grade) {
      toast({ variant: 'destructive', title: 'Grade Required', description: 'Please enter a grade for the Appearance certificate.' });
      return;
    }
     if (certificateType === 'Character' && !character) {
      toast({ variant: 'destructive', title: 'Character Required', description: 'Please enter a character description.' });
      return;
    }


    setIsLoading(true);
    setShowCertificates(false);
    setGeneratedCertificates([]);

    const studentsToProcess = students.filter(s => selectedStudents.has(s.id));

    try {
      const results = await Promise.all(studentsToProcess.map(async (student) => {
        const certificateText = await generateCertificateText(certificateType, student, grade, character);
        return { studentName: student.studentName, certificateText, student };
      }));
      
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

  const handlePrint = () => {
    // Set a class on the body to control @page CSS
    const body = document.body;
    body.classList.remove('print-a5-landscape', 'print-a5-portrait', 'print-a4-portrait'); // Clear old classes
    
    switch (certificateType) {
      case 'Appearance':
      case 'Character':
        body.classList.add('print-a5-landscape');
        break;
      case 'Pass':
        body.classList.add('print-a5-portrait');
        break;
      case 'School Leaving':
        body.classList.add('print-a4-portrait');
        break;
    }

    window.print();
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

            {certificateType === 'Appearance' && (
              <div>
                <Label htmlFor="grade-bulk">Grade</Label>
                <Input id="grade-bulk" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g., A+" />
              </div>
            )}
            
            {certificateType === 'Character' && (
              <div>
                <Label htmlFor="character-bulk">Character</Label>
                <Input id="character-bulk" value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="e.g., Good" />
              </div>
            )}


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
                    <Card key={index} className="printable-area aspect-[1.414/1] w-full shadow-lg flex flex-col justify-between p-8">
                      <CardHeader className="items-center text-center">
                          <img src="https://placehold.co/100x100.png" alt="School Logo" className="w-24 h-24 mx-auto mb-4 rounded-full" data-ai-hint="school logo" />
                          <h2 className="text-xl md:text-3xl font-bold tracking-wider">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h2>
                          <Separator className="my-4"/>
                          <CardTitle className="text-xl md:text-2xl font-bold tracking-widest uppercase text-primary pt-4">
                          {certificateType} Certificate
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 md:px-12 py-8 text-base md:text-lg leading-relaxed text-center flex-grow flex items-center justify-center">
                          <p dangerouslySetInnerHTML={{ __html: cert.certificateText }}></p>
                      </CardContent>
                      <CardContent className="px-4 md:px-12 pb-12">
                         <div className="flex justify-between items-end pt-8 mt-auto text-sm md:text-base">
                              <div className="text-center">
                                  <p className="font-semibold">Date:</p>
                                  <p>{format(new Date(), 'MMMM dd, yyyy')}</p>
                              </div>
                              <div className="text-center">
                                  <p className="border-t-2 border-foreground pt-2 px-4 md:px-8">First Assistant</p>
                              </div>
                               <div className="text-center">
                                  <p className="border-t-2 border-foreground pt-2 px-4 md:px-8">Headmaster</p>
                              </div>
                          </div>
                      </CardContent>
                    </Card>
                ))}

                <div className="mt-4 text-right no-print">
                    <Button onClick={handlePrint}>
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
