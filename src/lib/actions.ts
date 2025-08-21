
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { readStudents, writeStudents } from './data';
import type { Student } from './definitions';
import { loginSchema, studentSchema, type StudentFormValues } from './schema';
import * as XLSX from 'xlsx';


// --- AUTH ACTIONS ---

export async function login(values: z.infer<typeof loginSchema>) {
  // In a real app, you'd validate against a database
  if (values.email === 'ahmedaun1409@gmail.com' && values.password === '14aunmuhammad2728') {
    redirect('/dashboard');
  } else {
    return { error: 'Invalid email or password.' };
  }
}

// --- STUDENT ACTIONS ---

export async function getStudents() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  const students = await readStudents();
  return students;
}

export async function getStudentById(id: string) {
  const students = await readStudents();
  return students.find(student => student.id === id);
}

export async function addStudent(values: StudentFormValues) {
  const students = await readStudents();
  const existingStudent = students.find(student => student.grNo === values.grNo);
  if (existingStudent) {
    return { error: 'A student with this G.R. No. already exists.' };
  }

  const newStudent: Student = {
    ...studentSchema.parse(values),
    id: String(Date.now()),
  };
  
  const updatedStudents = [newStudent, ...students];
  await writeStudents(updatedStudents);

  revalidatePath('/dashboard');
  return { success: 'Student added successfully.' };
}

export async function updateStudent(id: string, values: StudentFormValues) {
  const students = await readStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    const existingStudentWithSameGrNo = students.find(s => s.grNo === values.grNo && s.id !== id);
    if (existingStudentWithSameGrNo) {
      return { error: 'Another student with this G.R. No. already exists.' };
    }
    students[index] = { ...students[index], ...studentSchema.parse(values), id: id };
    await writeStudents(students);
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/edit-student/${id}`);
    return { success: 'Student updated successfully.' };
  }
  return { error: 'Student not found.' };
}

export async function deleteStudent(id: string) {
  let students = await readStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students = students.filter(s => s.id !== id);
    await writeStudents(students);
    revalidatePath('/dashboard');
    return { success: 'Student deleted successfully.' };
  }
  return { error: 'Student not found.' };
}

export async function importFromExcel(fileContent: string) {
  try {
    const workbook = XLSX.read(fileContent, { type: 'binary', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(sheet);

    if (!data || data.length === 0) {
      return { error: 'Excel file is empty or invalid.' };
    }

    const currentStudents = await readStudents();
    const grNumbers = new Set(currentStudents.map(s => s.grNo));

    const newStudents: Student[] = [];
    for (const [index, row] of data.entries()) {
        const grNo = String(row.grNo);
        if (grNumbers.has(grNo)) {
            // Optionally, skip or handle duplicates
            console.log(`Skipping duplicate G.R. No: ${grNo}`);
            continue;
        }

        // Basic data transformation and validation
        const studentData = {
            grNo,
            studentName: row.studentName,
            fatherName: row.fatherName,
            raceAndCaste: row.raceAndCaste,
            bForm: row.bForm,
            placeOfBirth: row.placeOfBirth,
            dateOfBirth: new Date(row.dateOfBirth),
            dateOfBirthInWords: row.dateOfBirthInWords,
            religion: row.religion,
            lastSchoolAttended: row.lastSchoolAttended,
            admissionDate: new Date(row.admissionDate),
            classInWhichAdmitted: String(row.classInWhichAdmitted),
            cnic: row.cnic ? String(row.cnic) : '',
            guardianName: row.guardianName,
            guardianCnic: row.guardianCnic,
            relationshipWithGuardian: row.relationshipWithGuardian,
            contactNo: String(row.contactNo),
            disability: row.disability || 'None',
            vaccine: row.vaccine === 'Yes' ? 'Yes' : 'No',
            classStudying: String(row.classStudying),
            section: row.section,
            newEnrolReEnrol: row.newEnrolReEnrol === 'New Enrol' ? 'New Enrol' : 'Re-Enrol',
            remarks: row.remarks || '',
            dateOfLeaving: row.dateOfLeaving ? new Date(row.dateOfLeaving) : null,
            reasonOfLeaving: row.reasonOfLeaving || '',
            examination: row.examination || undefined,
            underSeatNo: row.underSeatNo || '',
            progress: row.progress || 'Good',
            conduct: row.conduct || 'Good',
            grade: row.grade || '',
            妣ype: row.妣ype || undefined,
            sscRollNo: row.sscRollNo || '',
        };

        const parsed = studentSchema.safeParse(studentData);
        if (parsed.success) {
            newStudents.push({ ...parsed.data, id: String(Date.now() + index) });
            grNumbers.add(grNo);
        } else {
            console.error(`Row ${index + 2} is invalid:`, parsed.error.flatten().fieldErrors);
            return { error: `Row ${index + 2} has invalid data. Please check the file and try again.` };
        }
    }

    const updatedStudents = [...currentStudents, ...newStudents];
    await writeStudents(updatedStudents);

    revalidatePath('/dashboard');
    return { success: `Successfully imported ${newStudents.length} new students.` };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to process the Excel file. Ensure columns match the required format.' };
  }
}
