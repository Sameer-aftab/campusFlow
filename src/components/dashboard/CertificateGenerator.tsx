'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Printer } from 'lucide-react';

import type { Student } from '@/lib/definitions';
import { generateCertificate } from '@/ai/flows/generate-certificate';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type CertificateType = 'Appearance' | 'Character' | 'Pass' | 'School Leaving';

const certificateTypes: CertificateType[] = ['Appearance', 'Character', 'Pass', 'School Leaving'];

export function CertificateGenerator({ student }: { student: Student }) {
  const { toast } = useToast();
  const [certificateType, setCertificateType] = useState<CertificateType>('Appearance');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setShowCertificate(false);
    
    const studentDataForAI = {
      ...student,
      dateOfBirth: format(new Date(student.dateOfBirth), 'yyyy-MM-dd'),
      admissionDate: format(new Date(student.admissionDate), 'yyyy-MM-dd'),
      dateOfLeaving: student.dateOfLeaving ? format(new Date(student.dateOfLeaving), 'yyyy-MM-dd') : 'N/A',
      cnic: student.cnic || 'N/A',
      remarks: student.remarks || 'N/A',
      reasonOfLeaving: student.reasonOfLeaving || 'N/A',
    };

    try {
      const result = await generateCertificate({
        studentData: studentDataForAI,
        certificateType,
      });
      setGeneratedText(result.certificateText);
      setShowCertificate(true);
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate the certificate. Please try again.',
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
            <CardDescription>Select a certificate type and generate it for the student.</CardDescription>
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
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="font-normal">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Certificate'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {showCertificate ? (
           <div className="space-y-4">
            <Card className="min-h-[500px] shadow-lg printable-area">
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
                <p>{generatedText}</p>
                
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
            <div className="mt-4 text-right no-print">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4"/>
                    Print Certificate
                </Button>
            </div>
          </div>
        ) : (
          <Card className="min-h-[500px] flex items-center justify-center border-dashed">
            <div className="text-center text-muted-foreground">
              <p>Your generated certificate will appear here.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
