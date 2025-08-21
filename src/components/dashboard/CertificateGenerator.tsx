'use client';

import { useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import { generatePdf } from '@/lib/pdf-generator';
import type { Student, CertificateType } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { certificateTypes } from '@/lib/definitions';
import { SchoolLogo } from './SchoolLogo';
import { AjrakBorder } from './AjrakBorder';


export function CertificateGenerator({ student }: { student: Student }) {
  const { toast } = useToast();
  const [certificateType, setCertificateType] = useState<CertificateType>('Appearance');
  const [grade, setGrade] = useState(student.grade || '');
  const [character, setCharacter] = useState(student.conduct || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
 
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    
    if (certificateType === 'School Leaving' && !student.dateOfLeaving) {
      toast({
        variant: 'destructive',
        title: 'Leaving Details Missing',
        description: `Please edit the student record for ${student.studentName} and add a "Date of Leaving" before generating this certificate.`,
        duration: 5000,
      });
      setIsDownloading(false);
      return;
    }

    if ((certificateType === 'Appearance' || certificateType === 'Pass' || certificateType === 'School Leaving') && !grade) {
      toast({ variant: 'destructive', title: 'Grade Required', description: 'Please enter a grade for this certificate type.' });
      setIsDownloading(false);
      return;
    }
     if (certificateType === 'Character' && !character) {
      toast({ variant: 'destructive', title: 'Character Required', description: 'Please enter a character description.' });
      setIsDownloading(false);
      return;
    }

    try {
      const doc = await generatePdf(certificateType, [student], grade, character);
      doc.save(`${student.studentName}-${certificateType}-Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: 'destructive',
        title: 'PDF Generation Failed',
        description: 'An error occurred while creating the PDF.',
      });
    } finally {
      setIsDownloading(false);
    }
  };


  const isLeavingCert = certificateType === 'School Leaving';

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
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
                onValueChange={(value: CertificateType) => {
                  setCertificateType(value);
                }}
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
            
            {(certificateType === 'Appearance' || certificateType === 'Pass' || isLeavingCert) && (
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g., A+" />
              </div>
            )}
            
            {certificateType === 'Character' && (
              <div>
                <Label htmlFor="character">Character</Label>
                <Input id="character" value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="e.g., Good" />
              </div>
            )}


            <Button onClick={handleDownloadPdf} disabled={isDownloading} className="w-full">
               {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
          <Card className="min-h-[700px] flex items-center justify-center border-dashed">
            <div className="text-center text-muted-foreground p-8">
              <h3 className="text-lg font-semibold mb-2">PDF Preview Unavailable</h3>
              <p>The certificate will be generated directly as a PDF file.</p>
              <p className="mt-4">Please select your options on the left and click 'Download PDF' to create the certificate.</p>
            </div>
          </Card>
      </div>
    </div>
  );
}
