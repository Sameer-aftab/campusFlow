'use server';

import { format } from 'date-fns';
import type { Student, CertificateType } from './definitions';

function formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    try {
      // Attempt to format assuming it's a valid date object or string
      return format(new Date(date), 'MMMM dd, yyyy');
    } catch (error) {
        // If it's an invalid date, return N/A
        return 'N/A';
    }
}

function formatValue(value: string | null | undefined): string {
  return value || 'N/A';
}

function getLogoSvg() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100" height="100" style="margin: 0 auto;">
      <defs>
        <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"></path>
      </defs>
      <g fill="black" stroke="black">
        <text style="font-size: 24px; letter-spacing: 2px;" fill="black">
          <textPath href="#circlePath" startOffset="50%" text-anchor="middle">
            GOVT.(N) NOOR MUHAMMAD HIGH SCHOOL*HYD*
          </textPath>
        </text>
        <path stroke="black" stroke-width="2" fill="none" d="M 60 55 L 60 145 C 60 155, 140 155, 140 145 L 140 55 C 120 40, 80 40, 60 55 Z" />
        <line x1="60" y1="100" x2="140" y2="100" stroke="black" stroke-width="2" />
        <line x1="100" y1="55" x2="100" y2="145" stroke="black" stroke-width="2" />
        <path d="M75 90 C 75 80, 85 80, 85 90" fill="none" stroke-width="1.5" />
        <path d="M80 82 Q 78 80, 76 82" fill="none" stroke-width="1.5" />
        <path d="M80 75 L 80 80" stroke-width="1.5" />
        <path d="M79 74 A 1 1 0 0 1 81 74 Z" fill="black"/>
        <path d="M115 80 A 10 10 0 1 1 115 79 Z" fill="none" stroke-width="1.5" />
        <path d="M117 80 A 8 8 0 1 0 117 79 Z" fill="white" stroke="none" />
        <path d="M 120 85 l 2 2 l -2 2 l -2 -2 Z" fill="black" />
        <path d="M 125 82 l 2 2 l -2 2 l -2 -2 Z" fill="black" />
        <path d="M 70 135 C 80 125, 120 125, 130 135" fill="none" stroke-width="2" />
        <path d="M 70 135 L 70 110 L 100 115 L 130 110 L 130 135" fill="none" stroke-width="2" />
        <line x1="100" y1="115" x2="100" y2="137" stroke-width="2"/>
      </g>
    </svg>
    `;
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
        return `<div class="w-full text-black font-sans flex flex-col justify-between h-full p-10">
            <header class="text-center space-y-4">
                <h1 class="text-3xl font-bold tracking-wide">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h1>
                ${getLogoSvg()}
                <h2 class="text-2xl font-bold tracking-widest uppercase text-black pt-4">SCHOOL LEAVING CERTIFICATE</h2>
            </header>

            <main class="text-base leading-relaxed my-6 space-y-2.5">
                <div class="flex justify-between">
                    <div><b>Name of Student:</b> <u class="px-2">${formatValue(studentName)}</u></div>
                    <div><b>G.R No:</b> <u class="px-2">${formatValue(grNo)}</u></div>
                </div>
                <div><b>Father's Name:</b> <u class="px-2">${formatValue(fatherName)}</u></div>
                <div><b>Race and Caste (With Sub-Caste):</b> <u class="px-2">${formatValue(raceAndCaste)}</u></div>
                <div><b>Religion:</b> <u class="px-2">${formatValue(religion)}</u></div>
                <div><b>Place of Birth:</b> <u class="px-2">${formatValue(placeOfBirth)}</u></div>
                <div><b>Date of Birth (in Figures):</b> <u class="px-2">${formatDate(dateOfBirth)}</u></div>
                <div><b>Date of Birth (in words):</b> <u class="px-2">${formatValue(dateOfBirthInWords)}</u></div>
                <div><b>Last School Attended:</b> <u class="px-2">${formatValue(lastSchoolAttended)}</u></div>
                <div><b>Date of Admission:</b> <u class="px-2">${formatDate(admissionDate)}</u></div>
                <div><b>Class in which admitted:</b> <u class="px-2">${formatValue(classInWhichAdmitted)}</u></div>
                
                <div class="grid grid-cols-2">
                    <div><b>Class in which studying:</b> <u class="px-2">${formatValue(classStudying)}</u></div>
                    <div><b>Conduct:</b> <u class="px-2">${formatValue(conduct)}</u></div>
                </div>
                
                <div><b>Progress:</b> <u class="px-2">${formatValue(progress)}</u></div>
                <div><b>Date of Leaving the School:</b> <u class="px-2">${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</u></div>
                <div><b>Reason of Leaving the School:</b> <u class="px-2">${formatValue(reasonOfLeaving)}</u></div>

                <div class="grid grid-cols-3">
                    <div><b>Examination:</b> <u class="px-2">${formatValue(examination)}</u></div>
                    <div><b>Under Seat No:</b> <u class="px-2">${formatValue(underSeatNo)}</u></div>
                    <div><b>Grade:</b> <u class="px-2">${formatValue(finalGrade)}</u></div>
                </div>
                <br/>
                <p><b>Certified that the above information is in accordance with the school General Register.</b></p>
            </main>

            <footer class="pt-12 mt-auto">
                <div class="flex justify-between items-end text-base">
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
