'use server';

import { format } from 'date-fns';
import type { Student, CertificateType } from './definitions';

function formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    // When creating a new Date from a string or a Date object, it's already in the correct timezone.
    // No need for UTC conversion.
    return format(new Date(date), 'MMMM dd, yyyy');
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
        return `<div class="w-full text-left space-y-3 text-base leading-relaxed">
            <div class="flex justify-between">
                <p><span class="font-bold">Name of Student:</span> <span class="border-b-2 border-black px-4">${studentName}</span></p>
                <p><span class="font-bold">G.R No:</span> <span class="border-b-2 border-black px-4">${grNo}</span></p>
            </div>
            <p><span class="font-bold">Father's Name:</span> <span class="border-b-2 border-black px-4">${fatherName}</span></p>
            <p><span class="font-bold">Race and Caste (With Sub-Caste):</span> <span class="border-b-2 border-black px-4">${raceAndCaste}</span></p>
            <p><span class="font-bold">Religion:</span> <span class="border-b-2 border-black px-4">${religion}</span></p>
            <p><span class="font-bold">Place of Birth:</span> <span class="border-b-2 border-black px-4">${placeOfBirth}</span></p>
            <p><span class="font-bold">Date of Birth (in Figures):</span> <span class="border-b-2 border-black px-4">${formatDate(dateOfBirth)}</span></p>
            <p><span class="font-bold">Date of Birth (in words):</span> <span class="border-b-2 border-black px-4">${dateOfBirthInWords}</span></p>
            <p><span class="font-bold">Last School Attended:</span> <span class="border-b-2 border-black px-4">${lastSchoolAttended}</span></p>
            <p><span class="font-bold">Date of Admission:</span> <span class="border-b-2 border-black px-4">${formatDate(admissionDate)}</span></p>
            <p><span class="font-bold">Class in which admitted:</span> <span class="border-b-2 border-black px-4">${classInWhichAdmitted}</span></p>
            <div class="flex justify-between">
                 <p><span class="font-bold">Class in which studying:</span> <span class="border-b-2 border-black px-4">${classStudying}</span></p>
                 <p><span class="font-bold">Conduct:</span> <span class="border-b-2 border-black px-4">${conduct}</span></p>
            </div>
             <p><span class="font-bold">Progress:</span> <span class="border-b-2 border-black px-4">${progress}</span></p>
            <p><span class="font-bold">Date of Leaving the School:</span> <span class="border-b-2 border-black px-4">${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</span></p>
            <p><span class="font-bold">Reason of Leaving the School:</span> Passed S.S.C Part-II Annual / Supplementary <span class="border-b-2 border-black px-4">${reasonOfLeaving}</span></p>
            <div class="flex justify-between">
                <p><span class="font-bold">Examination:</span> <span class="border-b-2 border-black px-4">${examination}</span></p>
                <p><span class="font-bold">Under Seat No:</span> <span class="border-b-2 border-black px-4">${underSeatNo}</span></p>
                <p><span class="font-bold">Grade:</span> <span class="border-b-2 border-black px-4">${finalGrade}</span></p>
            </div>
            <br/>
            <p class="font-bold">Certified that the above information is in accordance with the school General Register.</p>
        </div>`
            
        default:
            return 'Invalid certificate type.';
    }
}
