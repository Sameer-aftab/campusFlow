
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { readStudents, writeStudents } from './data';
import type { Student } from './definitions';
import { loginSchema, studentSchema } from './schema';
import * as XLSX from 'xlsx';


// --- AUTH ACTIONS ---

export async function login(values: z.infer<typeof loginSchema>) {
  // In a real app, you'd validate against a database
  if (values.email === 'admin@campusflow.com' && values.password === 'password123') {
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

export async function addStudent(values: z.infer<typeof studentSchema>) {
  const students = await readStudents();
  const existingStudent = students.find(student => student.grNo === values.grNo);
  if (existingStudent) {
    return { error: 'A student with this G.R. No. already exists.' };
  }

  const newStudent: Student = {
    ...values,
    id: String(Date.now()),
  };
  
  const updatedStudents = [newStudent, ...students];
  await writeStudents(updatedStudents);

  revalidatePath('/dashboard');
  return { success: 'Student added successfully.' };
}

export async function updateStudent(id: string, values: z.infer<typeof studentSchema>) {
  const students = await readStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    const existingStudentWithSameGrNo = students.find(s => s.grNo === values.grNo && s.id !== id);
    if (existingStudentWithSameGrNo) {
      return { error: 'Another student with this G.R. No. already exists.' };
    }
    students[index] = { ...students[index], ...values, id: id };
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

    const newStudents: Student[] = data.map((row, index) => {
        // Basic data transformation and validation could happen here
        // For now, we assume a direct mapping.
        // Dates from xlsx need to be handled carefully.
        const student: Student = {
            id: row.id || String(Date.now() + index),
            grNo: String(row.grNo),
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
            cnic: row.cnic || 'N/A',
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
            examination: row.examination || '',
            underSeatNo: row.underSeatNo || '',
            progress: row.progress || 'Good',
            conduct: row.conduct || 'Good',
            grade: row.grade || '',
        };
        return student;
    });

    // Replace the old student data with the new data
    await writeStudents(newStudents);

    revalidatePath('/dashboard');
    return { success: `Successfully imported ${newStudents.length} students.` };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to process the Excel file.' };
  }
}
