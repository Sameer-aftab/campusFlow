
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


function drawStyledText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineSpacing: number) {
    const parts = text.split(/(<b><u>.*?<\/u><\/b>)/g).filter(p => p);
    const lines: { text: string; isBold: boolean; isUnderlined: boolean; width: number }[][] = [];
    let currentLine: { text: string; isBold: boolean; isUnderlined: boolean; width: number }[] = [];
    let currentLineWidth = 0;

    parts.forEach(part => {
        const isStyled = part.startsWith('<b><u>') && part.endsWith('</u></b>');
        const cleanPart = part.replace(/<b><u>|<\/u><\/b>/g, '');
        const words = cleanPart.split(' ');

        words.forEach(word => {
            if (!word) return;
            const wordWithSpace = word + ' ';
            doc.setFont('helvetica', isStyled ? 'bold' : 'normal');
            const wordWidth = doc.getTextWidth(wordWithSpace);

            if (currentLineWidth + wordWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = [];
                currentLineWidth = 0;
            }

            currentLine.push({ text: wordWithSpace, isBold: isStyled, isUnderlined: isStyled, width: wordWidth });
            currentLineWidth += wordWidth;
        });
    });
    lines.push(currentLine);

    let currentY = y;
    lines.forEach(line => {
        const totalLineWidth = line.reduce((sum, part) => sum + part.width, 0);
        let currentX = x + (maxWidth - totalLineWidth) / 2; // Center align the line

        line.forEach(segment => {
            doc.setFont('helvetica', segment.isBold ? 'bold' : 'normal');
            doc.text(segment.text, currentX, currentY);

            if (segment.isUnderlined) {
                const textHeight = doc.getLineHeight() * 0.35;
                doc.setDrawColor(0);
                doc.setLineWidth(0.2);
                doc.line(currentX, currentY + 1, currentX + doc.getTextWidth(segment.text.trimEnd()), currentY + 1);
            }
            currentX += segment.width;
        });
        currentY += lineSpacing;
    });
}


function drawFooter(doc: jsPDF, pageHeight: number, margin: number, pageWidth: number) {
    const footerY = pageHeight - 30; // Move footer down
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const dateText = `Date: ${format(new Date(), 'MMMM dd, yyyy')}`;
    const faText = 'First Assistant';
    const chText = 'Chief Headmaster';
    
    const faWidth = doc.getTextWidth(faText);
    const chWidth = doc.getTextWidth(chText);

    const faX = pageWidth / 2 - faWidth / 2;
    const chX = pageWidth - margin - chWidth;

    // Draw lines for signatures
    doc.setLineWidth(0.3);
    doc.line(faX, footerY - 2, faX + faWidth, footerY - 2); // Line for First Assistant
    doc.line(chX, footerY - 2, chX + chWidth, footerY - 2); // Line for Chief Headmaster

    // Draw text below lines
    doc.text(dateText, margin, footerY);
    doc.text(faText, faX, footerY);
    doc.text(chText, chX, footerY);
}


// --- CERTIFICATE DRAWING FUNCTIONS ---

async function drawAppearanceCertificate(doc: jsPDF, student: Student, grade?: string) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD', pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.text('HIGH SCHOOL HYDERABAD', pageWidth / 2, y, { align: 'center' });
    
    if (logoBase64) {
      y += 5;
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, y, 30, 30);
    }
    y += 30; // Content moved up
    
    doc.setFontSize(14);
    doc.text('APPEARANCE CERTIFICATE', pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const currentYear = new Date().getFullYear();
    const finalGrade = grade || student.grade;
    const bodyText = `This is to certify that <b><u>${student.studentName}</u></b> S/O <b><u>${student.fatherName}</u></b> was a bonafide student of this School from <b><u>${formatDate(student.admissionDate)}</u></b> to <b><u>${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}</u></b>. He has filled the form of SSC part II Annual Examination <b><u>${currentYear}</u></b> and it is expected that he will secure atleast Grade <b><u>${finalGrade}</u></b> at the above said Examination. His date of birth as entered in this School General Register is <b><u>${formatDate(student.dateOfBirth)}</u></b>. He bears a good Character and I wish him success in future.`;
    
    drawStyledText(doc, bodyText, margin, y, contentWidth, 6);

    drawFooter(doc, pageHeight, margin, pageWidth);
}

async function drawCharacterCertificate(doc: jsPDF, student: Student, character?: string) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD', pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.text('HIGH SCHOOL HYDERABAD', pageWidth / 2, y, { align: 'center' });

    if(logoBase64) {
      y += 5;
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, y, 30, 30);
    }
    y += 30; // Content moved up
    
    doc.setFontSize(14);
    doc.text('CHARACTER CERTIFICATE', pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const finalCharacter = character || student.conduct;
    const bodyText = `This is to certify that <b><u>${student.studentName}</u></b>, S/O <b><u>${student.fatherName}</u></b> was a bonafide student of this School from <b><u>${formatDate(student.admissionDate)}</u></b> to <b><u>${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}</u></b>. To the best of my knowledge he bears a <b><u>${finalCharacter}</u></b> Moral character. I wish him good luck.`;
    
    drawStyledText(doc, bodyText, margin, y, contentWidth, 6);

    drawFooter(doc, pageHeight, margin, pageWidth);
}

async function drawPassCertificate(doc: jsPDF, student: Student) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD', pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.text('HIGH SCHOOL HYDERABAD', pageWidth / 2, y, { align: 'center' });

    if(logoBase64) {
      y += 5;
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, y, 30, 30);
    }
    y += 30; // Content moved up
    
    doc.setFontSize(14);
    doc.text('PASS CERTIFICATE', pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const bodyText = `This is to certify that Mr. <b><u>${formatValue(student.studentName)}</u></b> S/o <b><u>${formatValue(student.fatherName)}</u></b> by Caste <b><u>${formatValue(student.raceAndCaste)}</u></b> was enrolled under G.R.No: <b><u>${formatValue(student.grNo)}</u></b> and has been a bonafied student of this school from <b><u>${formatDate(student.admissionDate)}</u></b> to <b><u>${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}</u></b>. He has Passed class <b><u>${formatValue(student.examination)}</u></b>. According to School Record his date of Birth is <b><u>${formatDate(student.dateOfBirth)}</u></b> is in words <b><u>${formatValue(student.dateOfBirthInWords)}</u></b>. He bears a good moral and I wish him success in future.`;
    
    drawStyledText(doc, bodyText, margin, y, contentWidth, 6);
    
    drawFooter(doc, pageHeight, margin, pageWidth);
}


async function drawLeavingCertificate(doc: jsPDF, student: Student, grade?: string) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 20;

    // --- Border ---
    doc.setDrawColor(0);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    
    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Govt: (N) NOOR MUHAMMAD', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text('HIGH SCHOOL HYDERABAD', pageWidth / 2, y, { align: 'center' });
    y += 7;
    
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
        
        doc.setFont('helvetica', 'bold');
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

    doc.text(firstAssistantText, faX, footerY + 10);
    
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
