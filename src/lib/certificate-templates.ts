'use server';

import { format } from 'date-fns';
import type { Student, CertificateType } from './definitions';

function formatDate(date: Date | null | undefined): string {
    if (!date) return '________________';
    try {
      // Attempt to format assuming it's a valid date object or string
      return format(new Date(date), 'MMMM dd, yyyy');
    } catch (error) {
        // If it's an invalid date, return placeholder
        return '________________';
    }
}

function formatValue(value: string | null | undefined): string {
  return value || '________________';
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

function getAjrakBorderSvg() {
    return `
    <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; z-index: -1;" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="ajrak" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="scale(1)">
                <g fill="none" stroke="black" stroke-width="1.5">
                    <path d="M0 10h10V0h10v10h10V0h10v10h10V0h10v10h10V0h10v10" />
                    <path d="M10 80v-10h10v-10h10v-10h10v-10h10v-10h10v-10h10v-10h10" />
                    <path d="M20 20v10h10V20zm30 0v10h10V20zM0 40h10v10H0zm20 0h10v10H20zm20 0h10v10H40zm20 0h10v10H60z" />
                    <path d="M30 50h10v10H30zM10 60v10h10V60zm50 0v10h10V60z" />
                    <circle cx="25" cy="25" r="3" fill="black" />
                    <circle cx="55" cy="25" r="3" fill="black" />
                    <circle cx="5" cy="45" r="3" fill="black" />
                    <circle cx="25" cy="45" r="3" fill="black" />
                    <circle cx="45" cy="45" r="3" fill="black" />
                    <circle cx="65" cy="45" r="3" fill="black" />
                    <circle cx="35" cy="55" r="3" fill="black" />
                    <circle cx="15" cy="65" r="3" fill="black" />
                    <circle cx="55" cy="65" r="3" fill="black" />
                </g>
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="url(#ajrak)" stroke-width="40" />
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
        return `<div class="w-full text-black font-sans flex flex-col justify-between h-full p-10 relative">
            ${getAjrakBorderSvg()}
            <header class="text-center space-y-4">
                <h1 class="text-3xl font-bold tracking-wide">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h1>
                ${getLogoSvg()}
                <h2 class="text-2xl font-bold tracking-widest uppercase text-black pt-4">SCHOOL LEAVING CERTIFICATE</h2>
            </header>

            <main class="text-lg leading-relaxed my-6 space-y-3">
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <p><b>Name of Student:</b> <u style="padding: 0 8px;">${formatValue(studentName)}</u></p>
                    <p><b>G.R No:</b> <u style="padding: 0 8px;">${formatValue(grNo)}</u></p>
                </div>
                <p><b>Father's Name:</b> <u style="padding: 0 8px;">${formatValue(fatherName)}</u></p>
                <p><b>Race and Caste (With Sub-Caste):</b> <u style="padding: 0 8px;">${formatValue(raceAndCaste)}</u></p>
                <p><b>Religion:</b> <u style="padding: 0 8px;">${formatValue(religion)}</u></p>
                <p><b>Place of Birth:</b> <u style="padding: 0 8px;">${formatValue(placeOfBirth)}</u></p>
                <p><b>Date of Birth (in Figures):</b> <u style="padding: 0 8px;">${formatDate(dateOfBirth)}</u></p>
                <p><b>Date of Birth (in words):</b> <u style="padding: 0 8px;">${formatValue(dateOfBirthInWords)}</u></p>
                <p><b>Last School Attended:</b> <u style="padding: 0 8px;">${formatValue(lastSchoolAttended)}</u></p>
                <p><b>Date of Admission:</b> <u style="padding: 0 8px;">${formatDate(admissionDate)}</u></p>
                <p><b>Class in which admitted:</b> <u style="padding: 0 8px;">${formatValue(classInWhichAdmitted)}</u></p>
                
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <p><b>Class in which studying:</b> <u style="padding: 0 8px;">${formatValue(classStudying)}</u></p>
                    <p><b>Conduct:</b> <u style="padding: 0 8px;">${formatValue(conduct)}</u></p>
                </div>
                
                <p><b>Progress:</b> <u style="padding: 0 8px;">${formatValue(progress)}</u></p>
                <p><b>Date of Leaving the School:</b> <u style="padding: 0 8px;">${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</u></p>
                <p><b>Reason of Leaving the School:</b> <u style="padding: 0 8px;">${formatValue(reasonOfLeaving)}</u></p>

                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <p><b>Examination:</b> <u style="padding: 0 8px;">${formatValue(examination)}</u></p>
                    <p><b>Under Seat No:</b> <u style="padding: 0 8px;">${formatValue(underSeatNo)}</u></p>
                    <p><b>Grade:</b> <u style="padding: 0 8px;">${formatValue(finalGrade)}</u></p>
                </div>
                <br/>
                <p><b>Certified that the above information is in accordance with the school General Register.</b></p>
            </main>

            <footer class="pt-12 mt-auto">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%; font-size: 1.1rem;">
                    <div style="text-align: center;">
                        <p><b>Date:</b></p>
                        <p>${format(new Date(), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="border-top: 2px solid black; padding: 8px 48px 0;">First Assistant</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="border-top: 2px solid black; padding: 8px 48px 0;">Headmaster</p>
                    </div>
                </div>
            </footer>
        </div>`
            
        default:
            return 'Invalid certificate type.';
    }
}
