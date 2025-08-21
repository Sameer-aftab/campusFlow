
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
        return `<div class="w-full text-black font-sans bg-white flex flex-col p-4">
          <div class="w-full h-full relative border-2 border-black">
             <div class="p-4 flex flex-col justify-between h-full">
                <header class="text-center space-y-2 mb-4">
                  <h1 class="text-3xl font-bold tracking-wide">Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD</h1>
                  <div style="height: 120px; margin: 10px 0;"></div>
                  <h2 class="text-2xl font-bold tracking-widest uppercase text-black pt-2">SCHOOL LEAVING CERTIFICATE</h2>
                </header>

              <main class="text-base leading-relaxed my-3 space-y-3">
                  <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 0.5rem;">
                      <span><b>Name of Student:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(studentName)}</u></span>
                      <span><b>G.R No:</b> <u style="padding: 0 8px;">${formatValue(grNo)}</u></span>
                  </div>
                  <div style="margin-bottom: 0.5rem;"><b>Father's Name:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(fatherName)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Race and Caste (With Sub-Caste):</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(raceAndCaste)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Religion:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(religion)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Place of Birth:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(placeOfBirth)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Date of Birth (in Figures):</b> <u style="padding: 0 8px;">${formatDate(dateOfBirth)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Date of Birth (in words):</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(dateOfBirthInWords)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Last School Attended:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(lastSchoolAttended)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Date of Admission:</b> <u style="padding: 0 8px;">${formatDate(admissionDate)}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Class in which admitted:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(classInWhichAdmitted)}</u></div>
                  
                  <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 0.5rem;">
                      <span><b>Class in which studying:</b> <u style="padding: 0 8px;">${formatValue(classStudying)}</u></span>
                  </div>
                  
                  <div style="margin-bottom: 0.5rem;"><b>Progress:</b> <u style="padding: 0 8px;">${formatValue(progress)}</u> <span><b>Conduct:</b> <u style="padding: 0 8px;">${formatValue(conduct)}</u></span></div>
                  <div style="margin-bottom: 0.5rem;"><b>Date of Leaving the School:</b> <u style="padding: 0 8px;">${dateOfLeaving ? formatDate(dateOfLeaving) : 'N/A'}</u></div>
                  <div style="margin-bottom: 0.5rem;"><b>Reason of Leaving the School:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(reasonOfLeaving)}</u></div>

                  <div style="display: flex; justify-content: space-between; width: 100%; align-items: baseline; flex-wrap: wrap; margin-bottom: 0.5rem;">
                      <span style="margin-right: 1.5rem;"><b>Examination:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(examination)}</u></span>
                      <span style="margin-right: 1.5rem;"><b>Under Seat No:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(underSeatNo)}</u></span>
                      <span><b>Grade:</b> <u class="uppercase" style="padding: 0 8px;">${formatValue(finalGrade)}</u></span>
                  </div>
                  
                  <p style="margin-top: 1.5rem;"><b>Certified that the above information is in accordance with the school General Register.</b></p>
              </main>

              <footer class="pt-12 mt-auto">
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
