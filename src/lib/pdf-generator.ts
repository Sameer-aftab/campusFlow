
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

function drawTextWithBold(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineSpacing: number) {
    const parts = text.split(/<b>(.*?)<\/b>/g);
    let currentX = x;
    let currentY = y;
    const initialX = x;

    const splitOptions = { maxWidth: maxWidth, align: 'center' };
    const lines = doc.splitTextToSize(text.replace(/<b>/g, '').replace(/<\/b>/g, ''), maxWidth);

    let textCursor = 0;
    lines.forEach((line: string) => {
        let offsetX = 0;
        const lineLength = line.length;
        
        let segment = '';
        let isBold = false;

        const originalLineText = text.replace(/<b>/g, '').replace(/<\/b>/g, '').substring(textCursor, textCursor + lineLength);
        
        // Very complex to handle bolding with auto-wrapping. For now, we will draw the line as is.
        // A more robust solution might require a different library or a much more complex parser.
        // The key is to fix the layout first.
        
        // Simple approach: find bold tags in the original text and apply style if the line contains it.
        // This is not perfect but will fix the broken layout.
        
        doc.setFont('helvetica', 'normal');
        let tempLine = line;

        // A simplified bold implementation
        const boldRegex = /<b>(.*?)<\/b>/;
        // This simplified logic can't handle split bold tags across lines, but will bold if a tag is fully within a line.
        // Given the templates, this is a reasonable compromise to fix the layout destruction.
        const bodyParts = text.split(/<b>(.*?)<\/b>/g);
        let startX = x;

        // We will manually split text for now to control bolding.
        const words = text.split(' ');
        let currentLine = '';
        const wrappedLines = [];

        words.forEach(word => {
            const potentialLine = currentLine ? `${currentLine} ${word}` : word;
            const potentialLineWidth = doc.getTextWidth(potentialLine.replace(/<b>|<\/b>/g, ''));

            if (potentialLineWidth > maxWidth) {
                wrappedLines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = potentialLine;
            }
        });
        wrappedLines.push(currentLine);


        wrappedLines.forEach(lineTxt => {
            const segments = lineTxt.split(/<b>(.*?)<\/b>/g).filter(p => p);
            const totalLineWidth = doc.getTextWidth(segments.join(''));
            let segmentX = x + (maxWidth - totalLineWidth) / 2;

            segments.forEach((segment, index) => {
                const originalSegment = segment;
                const isSegmentBold = lineTxt.includes(`<b>${segment}</b>`);
                doc.setFont('helvetica', isSegmentBold ? 'bold' : 'normal');
                doc.text(segment, segmentX, currentY);
                segmentX += doc.getTextWidth(segment);
            });
            currentY += lineSpacing;
        });

        textCursor += lineLength + 1; // Move cursor past the current line and a space/newline
    });
}

function drawFooter(doc: jsPDF, pageHeight: number, margin: number, pageWidth: number) {
    const footerY = pageHeight - 40;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, margin, footerY);

    doc.line(pageWidth / 2 - 40, footerY + 5, pageWidth / 2 + 40, footerY + 5);
    doc.text('First Assistant', pageWidth / 2, footerY + 10, { align: 'center' });

    doc.line(pageWidth - margin - 60, footerY + 5, pageWidth - margin, footerY + 5);
    doc.text('Chief Headmaster', pageWidth - margin - 30, footerY + 10, { align: 'center' });
}


// --- CERTIFICATE DRAWING FUNCTIONS ---

async function drawAppearanceCertificate(doc: jsPDF, student: Student, grade?: string) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD', pageWidth / 2, 20, { align: 'center' });
    doc.text('HIGH SCHOOL HYDERABAD', pageWidth / 2, 28, { align: 'center' });
    
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, 33, 30, 30);
    }
    
    doc.setFontSize(14);
    doc.text('APPEARANCE CERTIFICATE', pageWidth / 2, 75, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const currentYear = new Date().getFullYear();
    const finalGrade = grade || student.grade;
    const bodyText = `This is to certify that <b>${student.studentName}</b> S/O <b>${student.fatherName}</b> was a bonafide student of this School from <b>${formatDate(student.admissionDate)}</b> to <b>${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}</b>. He has filled the form of SSC part II Annual Examination <b>${currentYear}</b> and it is expected that he will secure atleast Grade <b>${finalGrade}</b> at the above said Examination. His date of birth as entered in this School General Register is <b>${formatDate(student.dateOfBirth)}</b>. He bears a good Character and I wish him success in future.`;
    
    drawTextWithBold(doc, bodyText, margin, 95, contentWidth, 8);

    drawFooter(doc, pageHeight, margin, pageWidth);
}

async function drawCharacterCertificate(doc: jsPDF, student: Student, character?: string) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD', pageWidth / 2, 20, { align: 'center' });
    doc.text('HIGH SCHOOL HYDERABAD', pageWidth / 2, 28, { align: 'center' });
    if(logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, 33, 30, 30);
    }
    
    doc.setFontSize(14);
    doc.text('CHARACTER CERTIFICATE', pageWidth / 2, 75, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const finalCharacter = character || student.conduct;
    const bodyText = `This is to certify that <b>${student.studentName}</b>, S/O <b>${student.fatherName}</b> was a bonafide student of this School from <b>${formatDate(student.admissionDate)}</b> to <b>${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}</b>. To the best of my knowledge he bears a <b>${finalCharacter}</b> Moral character. I wish him good luck.`;
    
    drawTextWithBold(doc, bodyText, margin, 95, contentWidth, 8);

    drawFooter(doc, pageHeight, margin, pageWidth);
}

async function drawPassCertificate(doc: jsPDF, student: Student) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Govt: (N) NOOR MUHAMMAD', pageWidth / 2, 20, { align: 'center' });
    doc.text('HIGH SCHOOL HYDERABAD', pageWidth / 2, 28, { align: 'center' });

    if(logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 15, 33, 30, 30);
    }
    
    doc.setFontSize(14);
    doc.text('PASS CERTIFICATE', pageWidth / 2, 75, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const bodyText = `This is to certify that Mr. <b>${formatValue(student.studentName)}</b> S/o <b>${formatValue(student.fatherName)}</b> by Caste <b>${formatValue(student.raceAndCaste)}</b> was enrolled under G.R.No: <b>${formatValue(student.grNo)}</b> and has been a bonafied student of this school from <b>${formatDate(student.admissionDate)}</b> to <b>${student.dateOfLeaving ? formatDate(student.dateOfLeaving) : formatDate(new Date())}</b>. He has Passed class <b>${formatValue(student.examination)}</b>. According to School Record his date of Birth is <b>${formatDate(student.dateOfBirth)}</b> is in words <b>${formatValue(student.dateOfBirthInWords)}</b>. He bears a good moral and I wish him success in future.`;
    
    drawTextWithBold(doc, bodyText, margin, 95, contentWidth, 8);
    
    drawFooter(doc, pageHeight, margin, pageWidth);
}


async function drawLeavingCertificate(doc: jsPDF, student: Student, grade?: string) {
    const logoBase64 = await getBase64Image(window.location.origin + '/Logo.png');
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
