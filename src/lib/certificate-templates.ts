'use server';

import { format } from 'date-fns';
import type { Student } from './definitions';

export const certificateTypes = ['Appearance', 'Character', 'Pass', 'School Leaving'] as const;
export type CertificateType = typeof certificateTypes[number];

function formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMMM dd, yyyy');
}


export function generateCertificateText(type: CertificateType, student: Student): string {
    const { 
        studentName, 
        fatherName, 
        admissionDate, 
        dateOfLeaving, 
        grade, 
        dateOfBirth,
        progress,
        conduct,
        reasonOfLeaving,
    } = student;

    const currentYear = new Date().getFullYear();

    switch (type) {
        case 'Appearance':
            return `This is to certify that <b>${studentName}</b> S/O <b>${fatherName}</b> was a bonafide student of this School from ${formatDate(admissionDate)} to ${dateOfLeaving ? formatDate(dateOfLeaving) : 'the present day'}. He has filled the form of SSC part II Annual Examination ${currentYear} and that he will secure atleast grade <b>${grade}</b> at the above said Examination.
            <br/><br/>
            His date of birth as entered in this School General Register is <b>${formatDate(dateOfBirth)}</b>.
            <br/><br/>
            He bears a good Character and I wish him success in future.`;
        
        case 'Character':
             return `This is to certify that <b>${studentName}</b>, S/O <b>${fatherName}</b> is a student of this institution. As far as my knowledge goes he bears a good character.`;

        case 'Pass':
            return `This is to certify that <b>${studentName}</b>, S/O <b>${fatherName}</b> has passed the examination from this institution with grade <b>${grade}</b>.`;

        case 'School Leaving':
            return `This is to certify that <b>${studentName}</b>, S/O <b>${fatherName}</b> was a student of this institution. He left the school on <b>${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</b> because of <b>${reasonOfLeaving || 'N/A'}</b>. His progress was <b>${progress}</b> and his conduct was <b>${conduct}</b>.`;
            
        default:
            return 'Invalid certificate type.';
    }
}
