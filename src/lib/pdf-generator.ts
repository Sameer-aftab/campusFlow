

import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { Student, CertificateType } from './definitions';

// --- HELPER FUNCTIONS ---

function formatValue(value: string | null | undefined): string {
    return value || '________________';
}

function formatDate(date: Date | null | undefined): string {
    if (!date) return '________________';
    try {
        return format(new Date(date), 'dd-MM-yyyy');
    } catch (error) {
        return '________________';
    }
}

// Function to fetch image and convert to Base64
async function getBase64Image(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`Error fetching or converting image from ${url}:`, error);
        return '';
    }
}


// --- CERTIFICATE DRAWING FUNCTIONS ---

async function drawAppearanceCertificate(doc: jsPDF, student: Student, grade?: string) {
    const logoBase64 = await getBase64Image('/Logo.png');
    
    // --- Page Setup ---
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // --- Border ---
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD', pageWidth / 2, 20, { align: 'center' });
    
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, 25, 30, 30);
    }
    
    doc.setLineWidth(0.5);
    doc.line(margin, 60, pageWidth - margin, 60);

    doc.setFontSize(14);
    doc.text('APPEARANCE CERTIFICATE', pageWidth / 2, 70, { align: 'center' });

    // --- Body ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const currentYear = new Date().getFullYear();
    const bodyText = `This is to certify that ${student.studentName} S/O ${student.fatherName} was a bonafide student of this School from ${formatDate(student.admissionDate)} to ${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}. He has filled the form of SSC part II Annual Examination ${currentYear} and it is expected that he will secure atleast Grade ${grade || student.grade} at the above said Examination.\n\nHis date of birth as entered in this School General Register is ${formatDate(student.dateOfBirth)}.\n\nHe bears a good Character and I wish him success in future.`;
    
    const splitText = doc.splitTextToSize(bodyText, pageWidth - (margin * 2));
    doc.text(splitText, margin, 85);

    // --- Footer ---
    const footerY = pageHeight - 30;
    doc.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, margin, footerY);
    
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 25, footerY + 5, pageWidth / 2 + 25, footerY + 5);
    doc.text('First Assistant', pageWidth / 2, footerY + 10, { align: 'center' });

    doc.line(pageWidth - margin - 50, footerY + 5, pageWidth - margin, footerY + 5);
    doc.text('Chief Headmaster', pageWidth - margin - 25, footerY + 10, { align: 'center' });
}

async function drawCharacterCertificate(doc: jsPDF, student: Student, character?: string) {
    const logoBase64 = await getBase64Image('/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Border and Header are similar to Appearance Cert
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD', pageWidth / 2, 20, { align: 'center' });
    if(logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, 25, 30, 30);
    }
    doc.setLineWidth(0.5);
    doc.line(margin, 60, pageWidth - margin, 60);
    doc.setFontSize(14);
    doc.text('CHARACTER CERTIFICATE', pageWidth / 2, 70, { align: 'center' });

    // --- Body ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const finalCharacter = character || student.conduct;
    const bodyText = `This is to certify that ${student.studentName}, S/O ${student.fatherName} was a bonafide student of this School from ${formatDate(student.admissionDate)} to ${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}.\n\nTo the best of my knowledge he bears a ${finalCharacter} Moral character. I wish him good luck.`;
    const splitText = doc.splitTextToSize(bodyText, pageWidth - (margin * 2));
    doc.text(splitText, margin, 85);

    // --- Footer --- (Similar to Appearance)
    const footerY = pageHeight - 30;
    doc.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, margin, footerY);
    doc.line(pageWidth / 2 - 25, footerY + 5, pageWidth / 2 + 25, footerY + 5);
    doc.text('First Assistant', pageWidth / 2, footerY + 10, { align: 'center' });
    doc.line(pageWidth - margin - 50, footerY + 5, pageWidth - margin, footerY + 5);
    doc.text('Chief Headmaster', pageWidth - margin - 25, footerY + 10, { align: 'center' });
}

async function drawPassCertificate(doc: jsPDF, student: Student) {
    const logoBase64 = await getBase64Image('/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // --- Border & Header ---
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD', pageWidth / 2, 20, { align: 'center' });
    if(logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, 25, 30, 30);
    }
    doc.setLineWidth(0.5);
    doc.line(margin, 60, pageWidth - margin, 60);
    doc.setFontSize(14);
    doc.text('PASS CERTIFICATE', pageWidth / 2, 70, { align: 'center' });
    
    // --- Body ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const bodyText = `This is to certify that Mr. ${formatValue(student.studentName)} S/o ${formatValue(student.fatherName)} by Caste ${formatValue(student.raceAndCaste)} was enrolled under G.R.No: ${formatValue(student.grNo)} and has been a bonafied student of this school from ${formatDate(student.admissionDate)} to ${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}. He has Passed class ${formatValue(student.examination)}.\n\nAccording to School Record his date of Birth is ${formatDate(student.dateOfBirth)} is in words ${formatValue(student.dateOfBirthInWords)}.\n\nHe bears a good moral and I wish him success in future.`;
    const splitText = doc.splitTextToSize(bodyText, pageWidth - (margin * 2));
    doc.text(splitText, margin, 85);
    
    // --- Footer ---
    const footerY = pageHeight - 30;
    doc.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, margin, footerY);
    doc.line(pageWidth / 2 - 25, footerY + 5, pageWidth / 2 + 25, footerY + 5);
    doc.text('First Assistant', pageWidth / 2, footerY + 10, { align: 'center' });
    doc.line(pageWidth - margin - 50, footerY + 5, pageWidth - margin, footerY + 5);
    doc.text('Chief Headmaster', pageWidth - margin - 25, footerY + 10, { align: 'center' });
}


async function drawLeavingCertificate(doc: jsPDF, student: Student, grade?: string) {
    const logoBase64 = await getBase64Image('/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    // --- Border ---
    doc.setDrawColor(0);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.getHeight() - 10);
    
    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Govt: (N) NOOR MUHAMMAD HIGH SCHOOL HYDERABAD', pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 20, y, 40, 40);
    }
    y += 45;

    doc.setFontSize(18);
    doc.text('SCHOOL LEAVING CERTIFICATE', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // --- Body ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const drawField = (label: string, value: string, startX: number, startY: number, fullWidth: boolean = false) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, startX, startY);
        const labelWidth = doc.getTextWidth(label);
        
        doc.setFont('helvetica', 'normal');
        const formattedValue = formatValue(value).toUpperCase();
        doc.text(formattedValue, startX + labelWidth + 2, startY);
        
        const valueWidth = doc.getTextWidth(formattedValue);
        const underlineWidth = fullWidth ? (pageWidth - startX - labelWidth - 2 - margin) : valueWidth + 4;
        doc.setLineWidth(0.3);
        doc.line(startX + labelWidth + 1, startY + 1, startX + labelWidth + 1 + underlineWidth, startY + 1);
    };

    drawField('Name of Student:', student.studentName, margin, y);
    drawField('G.R No:', student.grNo, pageWidth - margin - 50, y);
    y += 8;

    drawField("Father's Name:", student.fatherName, margin, y, true);
    y += 8;
    drawField('Race and Caste (With Sub-Caste):', student.raceAndCaste, margin, y, true);
    y += 8;
    drawField('Religion:', student.religion, margin, y, true);
    y += 8;
    drawField('Place of Birth:', student.placeOfBirth, margin, y, true);
    y += 8;
    drawField('Date of Birth (in Figures):', formatDate(student.dateOfBirth), margin, y, true);
    y += 8;
    drawField('Date of Birth (in words):', student.dateOfBirthInWords, margin, y, true);
    y += 8;
    drawField('Last School Attended:', student.lastSchoolAttended, margin, y, true);
    y += 8;
    drawField('Date of Admission:', formatDate(student.admissionDate), margin, y, true);
    y += 8;
    drawField('Class in which admitted:', student.classInWhichAdmitted, margin, y, true);
    y += 8;
    drawField('Class in which studying:', student.classStudying, margin, y, true);
    y += 8;

    drawField('Progress:', student.progress, margin, y);
    drawField('Conduct:', student.conduct, pageWidth / 2, y);
    y += 8;
    
    drawField('Date of Leaving the School:', formatDate(student.dateOfLeaving), margin, y, true);
    y += 8;
    drawField('Reason of Leaving the School:', student.reasonOfLeaving, margin, y, true);
    y += 12;

    drawField('Examination:', student.examination, margin, y);
    drawField('Under Seat No:', student.underSeatNo, margin + 80, y);
    drawField('Grade:', grade || student.grade, margin + 140, y);
    y += 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Certified that the above information is in accordance with the school General Register.', margin, y);
    
    // --- Footer ---
    const footerY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    drawField('Date:', format(new Date(), 'MMMM dd, yyyy'), margin, footerY);

    const firstAssistantText = 'First Assistant';
    const chiefHeadmasterText = 'Chief Headmaster';
    
    const faX = pageWidth / 2 - (doc.getTextWidth(firstAssistantText) / 2);
    const chX = pageWidth - margin - doc.getTextWidth(chiefHeadmasterText);

    doc.line(faX - 5, footerY + 5, faX + doc.getTextWidth(firstAssistantText) + 5, footerY + 5);
    doc.text(firstAssistantText, faX, footerY + 10);
    
    doc.line(chX - 5, footerY + 5, chX + doc.getTextWidth(chiefHeadmasterText) + 5, footerY + 5);
    doc.text(chiefHeadmasterText, chX, footerY + 10);
}


// --- MAIN EXPORT FUNCTION ---

export async function generatePdf(type: CertificateType, students: Student[], gradeOverride?: string, characterOverride?: string) {
    let doc;

    if (type === 'School Leaving') {
        doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    } else {
        doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5' });
    }

    for (let i = 0; i < students.length; i++) {
        if (i > 0) {
            doc.addPage();
        }
        const student = students[i];
        
        switch (type) {
            case 'Appearance':
                await drawAppearanceCertificate(doc, student, gradeOverride);
                break;
            case 'Character':
                await drawCharacterCertificate(doc, student, characterOverride);
                break;
            case 'Pass':
                await drawPassCertificate(doc, student);
                break;
            case 'School Leaving':
                await drawLeavingCertificate(doc, student, gradeOverride);
                break;
            default:
                throw new Error('Invalid certificate type.');
        }
    }

    return doc;
}
