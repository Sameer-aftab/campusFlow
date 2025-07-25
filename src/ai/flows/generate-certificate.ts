// src/ai/flows/generate-certificate.ts
'use server';
/**
 * @fileOverview A certificate generation AI agent.
 *
 * - generateCertificate - A function that handles the certificate generation process.
 * - GenerateCertificateInput - The input type for the generateCertificate function.
 * - GenerateCertificateOutput - The return type for the generateCertificate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCertificateInputSchema = z.object({
  studentData: z.object({
    grNo: z.string().describe('G.R No'),
    studentName: z.string().describe('Student name'),
    fatherName: z.string().describe("Father's name"),
    caste: z.string().describe('Caste'),
    bForm: z.string().describe('B. Form'),
    dateOfBirth: z.string().describe('Date of Birth'),
    religion: z.string().describe('Religion'),
    admissionDate: z.string().describe('Admission Date'),
    cnic: z.string().describe('CNIC #'),
    guardianName: z.string().describe('Guardian Name'),
    guardianCnic: z.string().describe('Guardian CNIC#'),
    relationshipWithGuardian: z.string().describe('Relationship with Guardian'),
    contactNo: z.string().describe('Contact No.'),
    disability: z.string().describe('Disability if any'),
    vaccine: z.string().describe('Vaccine Y/N'),
    classStudying: z.string().describe('In Which class Studing'),
    section: z.string().describe('section'),
    newEnrolReEnrol: z.string().describe('New Enrol/Re Enrol'),
    remarks: z.string().describe('Remarks'),
    dateOfLeaving: z.string().describe('Date of leaving'),
    reasonOfLeaving: z.string().describe('Reason of Leaving'),
    progress: z.string().describe('progress'),
    conduct: z.string().describe('conduct'),
    grade: z.string().describe('Grade'),
  }).describe('Student Data'),
  certificateType: z.enum(['Appearance', 'Character', 'Pass', 'School Leaving']).describe('Type of certificate to generate'),
});
export type GenerateCertificateInput = z.infer<typeof GenerateCertificateInputSchema>;

const GenerateCertificateOutputSchema = z.object({
  certificateText: z.string().describe('The text of the generated certificate.'),
});
export type GenerateCertificateOutput = z.infer<typeof GenerateCertificateOutputSchema>;

export async function generateCertificate(input: GenerateCertificateInput): Promise<GenerateCertificateOutput> {
  return generateCertificateFlow(input);
}

const generateCertificatePrompt = ai.definePrompt({
  name: 'generateCertificatePrompt',
  input: {schema: GenerateCertificateInputSchema},
  output: {schema: GenerateCertificateOutputSchema},
  prompt: `You are an expert at generating school certificates for a boys' school. You will be given student data and the desired certificate type. Based on the certificate type, select the relevant information from the student data and generate the certificate text.

Student Data:
{{studentData}}

Certificate Type: {{certificateType}}


Here are example certificates for each type:

Appearance Certificate: This is to certify that {{studentName}}, S/O {{fatherName}} is bonafide student of this institution and he has a good moral character.
Character Certificate: This is to certify that {{studentName}}, S/O {{fatherName}} is a student of this institution. As far as my knowledge goes he bears a good character.
Pass Certificate: This is to certify that {{studentName}}, S/O {{fatherName}} has passed the examination from this institution with grade {{grade}}.
School Leaving Certificate: This is to certify that {{studentName}}, S/O {{fatherName}} was a student of this institution. He left the school on {{dateOfLeaving}} because of {{reasonOfLeaving}}.

Generate the certificate text using the provided student data and the specified certificate type. Be formal, and concise.
`,
});

const generateCertificateFlow = ai.defineFlow(
  {
    name: 'generateCertificateFlow',
    inputSchema: GenerateCertificateInputSchema,
    outputSchema: GenerateCertificateOutputSchema,
  },
  async input => {
    const {output} = await generateCertificatePrompt(input);
    return output!;
  }
);
