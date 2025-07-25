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
        return `<div class="w-full text-left space-y-2 text-sm leading-snug">
            <div class="grid grid-cols-2 gap-x-4">
                <p>Name of Student: <span class="border-b border-black flex-1">${studentName}</span></p>
                <p class="text-right">G.R No: <span class="border-b border-black">${grNo}</span></p>
            </div>
            <p>Father's Name: <span class="border-b border-black flex-1">${fatherName}</span></p>
            <p>Race and Caste (With Sub-Caste): <span class="border-b border-black flex-1">${raceAndCaste}</span></p>
            <p>Religion: <span class="border-b border-black flex-1">${religion}</span></p>
            <p>Place of Birth: <span class="border-b border-black flex-1">${placeOfBirth}</span></p>
            <p>Date of Birth (in Figures): <span class="border-b border-black flex-1">${formatDate(dateOfBirth)}</span></p>
            <p>Date of Birth (in words): <span class="border-b border-black flex-1">${dateOfBirthInWords}</span></p>
            <p>Last School Attended: <span class="border-b border-black flex-1">${lastSchoolAttended}</span></p>
            <p>Date of Admission: <span class="border-b border-black flex-1">${formatDate(admissionDate)}</span></p>
            <p>Class in which admitted: <span class="border-b border-black flex-1">${classInWhichAdmitted}</span></p>
            <div class="grid grid-cols-2 gap-x-4">
                 <p>Class in which studying: <span class="border-b border-black flex-1">${classStudying}</span></p>
                 <p>Conduct: <span class="border-b border-black flex-1">${conduct}</span></p>
            </div>
             <p>Progress: <span class="border-b border-black flex-1">${progress}</span></p>
            <p>Date of Leaving the School: <span class="border-b border-black flex-1">${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</span></p>
            <p>Reason of Leaving the School: Passed S.S.C Part-II Annual / Supplementary <span class="border-b border-black flex-1">${reasonOfLeaving}</span></p>
            <div class="grid grid-cols-3 gap-x-4">
                <p>Examination: <span class="border-b border-black flex-1">${examination}</span></p>
                <p>Under Seat No: <span class="border-b border-black flex-1">${underSeatNo}</span></p>
                <p>Grade: <span class="border-b border-black flex-1">${finalGrade}</span></p>
            </div>
            <br/>
            <p>Certified that the above information is in accordance with the school General Register.</p>
        </div>`
            
        default:
            return 'Invalid certificate type.';
    }
}
