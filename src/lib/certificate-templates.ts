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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100" height="100" style="margin: 0 auto; fill: black;">
      <defs>
        <path
          id="circlePath"
          d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
        ></path>
      </defs>
      <g stroke="black">
        <text style="font-size: 24px; letter-spacing: 2px;" fill="black">
          <textPath href="#circlePath" startOffset="50%" text-anchor="middle">
            GOVT.(N) NOOR MUHAMMAD HIGH SCHOOL*HYD*
          </textPath>
        </text>
        <path
          stroke-width="2"
          fill="none"
          d="M 60 55 L 60 145 C 60 155, 140 155, 140 145 L 140 55 C 120 40, 80 40, 60 55 Z"
        />
        <line x1="60" y1="100" x2="140" y2="100" stroke-width="2" />
        <line x1="100" y1="55" x2="100" y2="145" stroke-width="2" />

        {/* Top-left quadrant: Candle */}
        <path d="M75 90 C 75 80, 85 80, 85 90" fill="none" stroke-width="1.5" />
        <path d="M80 82 Q 78 80, 76 82" fill="none" stroke-width="1.5" />
        <path d="M80 75 L 80 80" stroke-width="1.5" />
        <path d="M79 74 A 1 1 0 0 1 81 74 Z" fill="black"/>

        {/* Top-right quadrant: Crescent and stars */}
        <path d="M115 80 A 10 10 0 1 1 115 79 Z" fill="none" stroke-width="1.5" />
        <path d="M117 80 A 8 8 0 1 0 117 79 Z" fill="white" stroke="none" />
        <path d="M 120 85 l 2 2 l -2 2 l -2 -2 Z" fill="black" />
        <path d="M 125 82 l 2 2 l -2 2 l -2 -2 Z" fill="black" />

         {/* Bottom quadrant: Book */}
        <path d="M 70 135 C 80 125, 120 125, 130 135" fill="none" stroke-width="2" />
        <path d="M 70 135 L 70 110 L 100 115 L 130 110 L 130 135" fill="none" stroke-width="2" />
        <line x1="100" y1="115" x2="100" y2="137" stroke-width="2"/>

      </g>
    </svg>
    `;
}

function getUniformBorderSvg() {
    return `
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="border-pattern" patternUnits="userSpaceOnUse" width="5" height="5">
          <rect width="5" height="5" fill="white" />
          <path d="M0,0 L2.5,2.5 L0,5 Z" fill="black" />
          <path d="M5,0 L2.5,2.5 L5,5 Z" fill="black" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="5" fill="url(#border-pattern)" />
      <rect x="0" y="95" width="100" height="5" fill="url(#border-pattern)" />
      <rect x="0" y="5" width="5" height="90" fill="url(#border-pattern)" />
      <rect x="95" y="5" width="5" height="90" fill="url(#border-pattern)" />
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
            return `This is to certify that <b>${studentName}</b> S/O <b>${fatherName}</b> was a bonafide student of this School from ${formatDate(admissionDate)} to ${dateOfLeaving ? formatDate(dateOfLeaving) : formatDate(new Date())}. He has filled the form of SSC part II Annual Examination ${currentYear} and it is expected that he will secure atleast Grade <b>${finalGrade}</b> at the above said Examination.
            <br/><br/>
            His date of birth as entered in this School General Register is <b>${formatDate(dateOfBirth)}</b>.
            <br/><br/>
            He bears a good Character and I wish him success in future.`;
        
        case 'Character':
             const finalCharacter = characterOverride || conduct;
             return `This is to certify that <b>${studentName}</b>, S/O <b>${fatherName}</b> was a bonafide student of this School from <b>${formatDate(admissionDate)}</b> to <b>${dateOfLeaving ? formatDate(dateOfLeaving) : formatDate(new Date())}</b>.To the best of my knowledge he bears a <b>${finalCharacter}</b> Moral character I wist him good`;

        case 'Pass':
            return `this is certify that Mr. <b>${formatValue(studentName)}</b> S/o <b>${formatValue(fatherName)}</b> by Caste <b>${formatValue(raceAndCaste)}</b>
            <br/><br/>
            was enrolled under G.R.No: <b>${formatValue(grNo)}</b> and has been a bonafied student of this school from <b>${formatDate(admissionDate)}</b> to <b>${dateOfLeaving ? formatDate(dateOfLeaving) : formatDate(new Date())}</b> He has Passed class <b>${formatValue(examination)}</b>
            <br/><br/>
            According to School Record his date of Birth is <b>${formatDate(dateOfBirth)}</b>is in words<b>${formatValue(dateOfBirthInWords)}</b>
            <br/><br/>
            he bears a good moral and i wish him success in future`;

        case 'School Leaving':
        return `<div class="w-full text-black font-sans bg-white p-10" style="height: 100vh; display: flex; flex-direction: column;">
          <div class="w-full h-full relative border-2 border-black" style="padding: 2rem;">
            ${getUniformBorderSvg()}
             <div class="p-8 flex flex-col justify-between h-full" style="padding: 2rem;">
                <header class="text-center space-y-2 mb-6">
                  <h1 class="text-3xl font-bold tracking-wide">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h1>
                  <!-- LOGO_PLACEHOLDER -->
                  <div style="height: 120px; margin: 20px 0;"></div>
                  <h2 class="text-2xl font-bold tracking-widest uppercase text-black pt-2">SCHOOL LEAVING CERTIFICATE</h2>
                </header>

              <main class="text-lg leading-relaxed my-4 space-y-4">
                  <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 1rem;">
                      <span><b>Name of Student:</b> <u style="padding: 0 8px;">${formatValue(studentName)}</u></span>
                      <span><b>G.R No:</b> <u style="padding: 0 8px;">${formatValue(grNo)}</u></span>
                  </div>
                  <div style="margin-bottom: 1rem;"><b>Father's Name:</b> <u style="padding: 0 8px;">${formatValue(fatherName)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Race and Caste (With Sub-Caste):</b> <u style="padding: 0 8px;">${formatValue(raceAndCaste)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Religion:</b> <u style="padding: 0 8px;">${formatValue(religion)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Place of Birth:</b> <u style="padding: 0 8px;">${formatValue(placeOfBirth)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Date of Birth (in Figures):</b> <u style="padding: 0 8px;">${formatDate(dateOfBirth)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Date of Birth (in words):</b> <u style="padding: 0 8px;">${formatValue(dateOfBirthInWords)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Last School Attended:</b> <u style="padding: 0 8px;">${formatValue(lastSchoolAttended)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Date of Admission:</b> <u style="padding: 0 8px;">${formatDate(admissionDate)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Class in which admitted:</b> <u style="padding: 0 8px;">${formatValue(classInWhichAdmitted)}</u></div>
                  
                  <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 1rem;">
                      <span><b>Class in which studying:</b> <u style="padding: 0 8px;">${formatValue(classStudying)}</u></span>
                      <span><b>Conduct:</b> <u style="padding: 0 8px;">${formatValue(conduct)}</u></span>
                  </div>
                  
                  <div style="margin-bottom: 1rem;"><b>Progress:</b> <u style="padding: 0 8px;">${formatValue(progress)}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Date of Leaving the School:</b> <u style="padding: 0 8px;">${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</u></div>
                  <div style="margin-bottom: 1rem;"><b>Reason of Leaving the School:</b> <u style="padding: 0 8px;">${formatValue(reasonOfLeaving)}</u></div>

                  <div style="display: flex; justify-content: space-between; width: 100%; align-items: baseline; flex-wrap: wrap; margin-bottom: 1rem;">
                      <span style="margin-right: 1.5rem;"><b>Examination:</b> <u style="padding: 0 8px;">${formatValue(examination)}</u></span>
                      <span style="margin-right: 1.5rem;"><b>Under Seat No:</b> <u style="padding: 0 8px;">${formatValue(underSeatNo)}</u></span>
                      <span><b>Grade:</b> <u style="padding: 0 8px;">${formatValue(finalGrade)}</u></span>
                  </div>
                  
                  <p style="margin-top: 1.5rem;"><b>Certified that the above information is in accordance with the school General Register.</b></p>
              </main>

              <footer class="pt-16 mt-auto">
                  <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%; font-size: 1rem;">
                      <div style="text-align: center;">
                          <span><b>Date:</b></span>
                          <span style="padding: 0 8px; border-bottom: 1px solid black;">${format(new Date(), 'MMMM dd, yyyy')}</span>
                      </div>
                      <div style="text-align: center; border-top: 1px solid black; padding: 4px 48px 0;">
                          First Assistant
                      </div>
                      <div style="text-align: center; border-top: 1px solid black; padding: 4px 48px 0;">
                          Chief Headmaster
                      </div>
                  </div>
              </footer>
            </div>
          </div>
        </div>`;
            
        default:
            return 'Invalid certificate type.';
    }
}


