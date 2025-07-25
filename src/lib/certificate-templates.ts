'use server';

import { format } from 'date-fns';
import type { Student, CertificateType } from './definitions';

function formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMMM dd, yyyy');
}

function formatValue(value: string | null | undefined): string {
  return value || 'N/A';
}

export async function generateCertificateText(type: CertificateType, student: Student, gradeOverride?: string, characterOverride?: string): Promise<string> {
    const { 
        studentName, 
        fatherName, 
        admissionDate, 
        dateOfLeaving, 
        grade, 
        dateOfBirth,
        dateOfBirthInWords,
        progress,
        conduct,
        reasonOfLeaving,
        grNo,
        raceAndCaste,
        religion,
        placeOfBirth,
        lastSchoolAttended,
        classInWhichAdmitted,
        classStudying,
        examination,
        underSeatNo,
    } = student;

    const currentYear = new Date().getFullYear();
    const finalGrade = gradeOverride || grade;

    switch (type) {
        case 'Appearance':
            return `This is to certify that <b>${studentName}</b> S/O <b>${fatherName}</b> was a bonafide student of this School from ${formatDate(admissionDate)} to ${dateOfLeaving ? formatDate(dateOfLeaving) : formatDate(new Date())}. He has filled the form of SSC part II Annual Examination ${currentYear} and that he will secure atleast grade <b>${finalGrade}</b> at the above said Examination.
            <br/><br/>
            His date of birth as entered in this School General Register is <b>${formatDate(dateOfBirth)}</b>.
            <br/><br/>
            He bears a good Character and I wish him success in future.`;
        
        case 'Character':
             const finalCharacter = characterOverride || conduct;
             return `This is to certify that <b>${studentName}</b>, S/O <b>${fatherName}</b> is a student of this institution. As far as my knowledge goes he bears a <b>${finalCharacter}</b> character.`;

        case 'Pass':
            return `This is to certify that <b>${studentName}</b>, S/O <b>${fatherName}</b> has passed the examination from this institution with grade <b>${finalGrade}</b>.`;

        case 'School Leaving':
        return `<div class="w-full text-base font-sans flex flex-col justify-between h-full">
            <header class="text-center space-y-4">
                <h1 class="text-3xl font-bold tracking-wide">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h1>
                <img src="https://placehold.co/100x100.png" alt="School Logo" class="w-24 h-24 mx-auto rounded-full" data-ai-hint="school logo" />
                <h2 class="text-2xl font-bold tracking-widest uppercase text-black pt-4">SCHOOL LEAVING CERTIFICATE</h2>
            </header>

            <main class="text-lg leading-relaxed my-8 space-y-3">
                <div class="flex justify-between">
                    <div><b>Name of Student:</b> <u class="px-4">${formatValue(studentName)}</u></div>
                    <div><b>G.R No:</b> <u class="px-4">${formatValue(grNo)}</u></div>
                </div>
                <div><b>Father's Name:</b> <u class="px-4">${formatValue(fatherName)}</u></div>
                <div><b>Race and Caste (With Sub-Caste):</b> <u class="px-4">${formatValue(raceAndCaste)}</u></div>
                <div><b>Religion:</b> <u class="px-4">${formatValue(religion)}</u></div>
                <div><b>Place of Birth:</b> <u class="px-4">${formatValue(placeOfBirth)}</u></div>
                <div><b>Date of Birth (in Figures):</b> <u class="px-4">${formatDate(dateOfBirth)}</u></div>
                <div><b>Date of Birth (in words):</b> <u class="px-4">${formatValue(dateOfBirthInWords)}</u></div>
                <div><b>Last School Attended:</b> <u class="px-4">${formatValue(lastSchoolAttended)}</u></div>
                <div><b>Date of Admission:</b> <u class="px-4">${formatDate(admissionDate)}</u></div>
                <div><b>Class in which admitted:</b> <u class="px-4">${formatValue(classInWhichAdmitted)}</u></div>
                <div class="flex justify-between">
                    <div><b>Class in which studying:</b> <u class="px-4">${formatValue(classStudying)}</u></div>
                    <div><b>Conduct:</b> <u class="px-4">${formatValue(conduct)}</u></div>
                </div>
                <div><b>Progress:</b> <u class="px-4">${formatValue(progress)}</u></div>
                <div><b>Date of Leaving the School:</b> <u class="px-4">${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</u></div>
                <div><b>Reason of Leaving the School:</b> <u class="px-4">${formatValue(reasonOfLeaving)}</u></div>
                <div class="flex justify-between">
                    <div><b>Examination:</b> <u class="px-4">${formatValue(examination)}</u></div>
                    <div><b>Under Seat No:</b> <u class="px-4">${formatValue(underSeatNo)}</u></div>
                    <div><b>Grade:</b> <u class="px-4">${formatValue(finalGrade)}</u></div>
                </div>
                <br/>
                <p><b>Certified that the above information is in accordance with the school General Register.</b></p>
            </main>

            <footer class="pt-16 mt-auto">
                <div class="flex justify-between items-end text-lg">
                    <div class="text-center">
                        <p><b>Date:</b></p>
                        <p>${format(new Date(), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div class="text-center">
                        <p class="border-t-2 border-black pt-2 px-12">First Assistant</p>
                    </div>
                    <div class="text-center">
                        <p class="border-t-2 border-black pt-2 px-12">Headmaster</p>
                    </div>
                </div>
            </footer>
        </div>`
            
        default:
            return 'Invalid certificate type.';
    }
}
