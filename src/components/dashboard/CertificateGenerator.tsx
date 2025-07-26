'use client';

import { useState } from 'react';
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
import { generateCertificateText } from '@/lib/certificate-templates';
import { certificateTypes } from '@/lib/definitions';
import { SchoolLogo } from './SchoolLogo';
import { AjrakBorder } from './AjrakBorder';


export function CertificateGenerator({ student }: { student: Student }) {
  const { toast } = useToast();
  const [certificateType, setCertificateType] = useState<CertificateType>('Appearance');
  const [grade, setGrade] = useState(student.grade || '');
  const [character, setCharacter] = useState(student.conduct || '');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setShowCertificate(false);
    
    if (certificateType === 'School Leaving' && !student.dateOfLeaving) {
      toast({
        variant: 'destructive',
        title: 'Leaving Details Missing',
        description: `Please edit the student record for ${student.studentName} and add a "Date of Leaving" before generating this certificate.`,
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    if ((certificateType === 'Appearance' || certificateType === 'Pass' || certificateType === 'School Leaving') && !grade) {
      toast({ variant: 'destructive', title: 'Grade Required', description: 'Please enter a grade for this certificate type.' });
      setIsLoading(false);
      return;
    }
    if (certificateType === 'Character' && !character) {
      toast({ variant: 'destructive', title: 'Character Required', description: 'Please enter a character description.' });
      setIsLoading(false);
      return;
    }

    try {
      const text = await generateCertificateText(certificateType, student, grade, character);
      setGeneratedText(text);
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

  const handlePrint = () => {
    const body = document.body;
    body.classList.remove('print-a5-landscape', 'print-a5-portrait', 'print-a4-portrait');
    
    switch (certificateType) {
      case 'Appearance':
      case 'Character':
      case 'Pass':
        body.classList.add('print-a5-landscape');
        break;
      case 'School Leaving':
        body.classList.add('print-a4-portrait');
        break;
    }

    window.print();
  };

  const isLeavingCert = certificateType === 'School Leaving';
  const CertWrapper = isLeavingCert ? 'div' : Card;


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
                onValueChange={(value: CertificateType) => {
                  setCertificateType(value);
                  setShowCertificate(false);
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
            <div className="mb-4 text-right no-print">
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4"/>
                    Print Certificate
                </Button>
            </div>
            <CertWrapper className={`printable-area w-full relative ${isLeavingCert ? 'bg-white text-black' : 'shadow-lg flex flex-col justify-between aspect-[1.414/1]'}`}>
              {isLeavingCert ? (
                 <div dangerouslySetInnerHTML={{ __html: generatedText }} />
              ) : (
                <>
                  <AjrakBorder />
                  <div className="p-8 flex flex-col justify-between h-full">
                    <CardHeader className="items-center text-center">
                      <h2 className="text-xl md:text-3xl font-bold tracking-wider">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h2>
                      <div className="w-24 h-24 mx-auto mt-4"><SchoolLogo /></div>
                      <Separator className="my-4"/>
                      <CardTitle className="text-xl md:text-2xl font-bold tracking-widest uppercase text-primary pt-4">
                        {certificateType} Certificate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-8 text-base md:text-lg leading-relaxed text-center flex-grow flex items-center justify-center">
                      <div dangerouslySetInnerHTML={{ __html: generatedText }} />
                    </CardContent>
                    <CardContent className="pb-0">
                      <div className="flex justify-between items-end pt-8 mt-auto text-sm md:text-base">
                            <div className="text-center">
                                <p className="font-semibold">Date:</p>
                                <p>{format(new Date(), 'MMMM dd, yyyy')}</p>
                            </div>
                            <div className="text-center">
                                <p className="border-t-2 border-foreground pt-2 px-4 md:px-8">First Assistant</p>
                            </div>
                            <div className="text-center">
                                <p className="border-t-2 border-foreground pt-2 px-4 md:px-8">Chief Headmaster</p>
                            </div>
                        </div>
                    </CardContent>
                  </div>
                </>
              )}
            </CertWrapper>
          </div>
        ) : (
          <Card className="min-h-[700px] flex items-center justify-center border-dashed no-print">
            <div className="text-center text-muted-foreground">
              <p>Your generated certificate will appear here.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
