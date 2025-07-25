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
    <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; z-index: -1;" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
            <pattern id="ajrak-top-print" patternUnits="userSpaceOnUse" width="100" height="30" patternTransform="scale(1)">
                <rect width="100" height="30" fill="red" />
                <rect y="12" width="100" height="6" fill="black" />
                <g fill="white">
                    <circle cx="10" cy="15" r="2" />
                    <rect x="20" y="13" width="10" height="4" />
                    <circle cx="40" cy="15" r="2" />
                    <rect x="50" y="13" width="10" height="4" />
                    <circle cx="70" cy="15" r="2" />
                    <rect x="80" y="13" width="10" height="4" />
                    <circle cx="100" cy="15" r="2" />
                </g>
                 <g fill="white">
                    <circle cx="5" cy="5" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="25" cy="5" r="1" />
                    <circle cx="35" cy="5" r="1" />
                    <circle cx="45" cy="5" r="1" />
                    <circle cx="55" cy="5" r="1" />
                    <circle cx="65" cy="5" r="1" />
                    <circle cx="75" cy="5" r="1" />
                    <circle cx="85" cy="5" r="1" />
                    <circle cx="95" cy="5" r="1" />
                    <circle cx="5" cy="25" r="1" />
                    <circle cx="15" cy="25" r="1" />
                    <circle cx="25" cy="25" r="1" />
                    <circle cx="35" cy="25" r="1" />
                    <circle cx="45" cy="25" r="1" />
                    <circle cx="55" cy="25" r="1" />
                    <circle cx="65" cy="25" r="1" />
                    <circle cx="75" cy="25" r="1" />
                    <circle cx="85" cy="25" r="1" />
                    <circle cx="95" cy="25" r="1" />
                </g>
            </pattern>
            <pattern id="ajrak-main-print" patternUnits="userSpaceOnUse" width="120" height="120" patternTransform="scale(1)">
                <rect width="120" height="120" fill="black" />
                <path d="M60 10 C 30 10, 10 30, 10 60 C 10 90, 30 110, 60 110 C 90 110, 110 90, 110 60 C 110 30, 90 10, 60 10 Z" fill="red"/>
                <circle cx="60" cy="60" r="15" fill="black"/>
                <circle cx="60" cy="60" r="8" fill="red"/>
                <g fill="white" transform="translate(60,60)">
                    <path transform="rotate(0)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    <path transform="rotate(45)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    <path transform="rotate(90)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    <path transform="rotate(135)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    <path transform="rotate(180)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    <path transform="rotate(225)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    <path transform="rotate(270)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    <path transform="rotate(315)" d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                </g>
                <g fill="white">
                    <path d="M10 60 C 20 40, 20 20, 40 10 L 30 30 C 30 30, 40 50, 10 60 Z"/>
                    <path d="M110 60 C 100 40, 100 20, 80 10 L 90 30 C 90 30, 80 50, 110 60 Z"/>
                    <path d="M10 60 C 20 80, 20 100, 40 110 L 30 90 C 30 90, 40 70, 10 60 Z"/>
                    <path d="M110 60 C 100 80, 100 100, 80 110 L 90 90 C 90 90, 80 70, 110 60 Z"/>
                    <path d="M60 10 C 40 20, 20 20, 10 40 L 30 30 C 30 30, 50 40, 60 10 Z" transform="rotate(90, 60, 60)"/>
                    <path d="M60 110 C 40 100, 20 100, 10 80 L 30 90 C 30 90, 50 80, 60 110 Z" transform="rotate(90, 60, 60)"/>
                    <path d="M60 10 C 80 20, 100 20, 110 40 L 90 30 C 90 30, 70 40, 60 10 Z" transform="rotate(-90, 60, 60)"/>
                    <path d="M60 110 C 80 100, 100 100, 110 80 L 90 90 C 90 90, 70 80, 60 110 Z" transform="rotate(-90, 60, 60)"/>
                </g>
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="30" fill="url(#ajrak-top-print)" />
        <rect x="0" y="30" width="30" height="calc(100% - 60px)" fill="url(#ajrak-main-print)" />
        <rect x="calc(100% - 30px)" y="30" width="30" height="calc(100% - 60px)" fill="url(#ajrak-main-print)" />
        <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#ajrak-top-print)" />
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
