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
    
    if (certificateType === 'Appearance' && !grade) {
      toast({ variant: 'destructive', title: 'Grade Required', description: 'Please enter a grade for the Appearance certificate.' });
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
            
            {certificateType === 'Appearance' && (
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
            <Card className="h-[210mm] w-[297mm] -translate-x-[15%] shadow-lg printable-area flex flex-col justify-between p-8">
              <CardHeader className="items-center text-center">
                 <img src="https://placehold.co/100x100.png" alt="School Logo" className="w-24 h-24 mx-auto mb-4 rounded-full" data-ai-hint="school logo" />
                <h2 className="text-3xl font-bold tracking-wider">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h2>
                <Separator className="my-4"/>
                <CardTitle className="text-2xl font-bold tracking-widest uppercase text-primary pt-4">
                  {certificateType} Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="px-12 py-8 text-lg leading-relaxed text-center flex-grow flex items-center justify-center">
                <p dangerouslySetInnerHTML={{ __html: generatedText }} />
              </CardContent>
               <CardContent className="px-12 pb-12">
                 <div className="flex justify-between items-end pt-8 mt-auto">
                      <div className="text-center">
                          <p className="font-semibold">Date:</p>
                          <p>{format(new Date(), 'MMMM dd, yyyy')}</p>
                      </div>
                      <div className="text-center">
                          <p className="border-t-2 border-foreground pt-2 px-8">First Assistant</p>
                      </div>
                       <div className="text-center">
                          <p className="border-t-2 border-foreground pt-2 px-8">Headmaster</p>
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
          <Card className="min-h-[700px] flex items-center justify-center border-dashed">
            <div className="text-center text-muted-foreground">
              <p>Your generated certificate will appear here.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
