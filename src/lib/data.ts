
import type { Student } from './definitions';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/students.json');

// Helper function to read students from the JSON file
export async function readStudents(): Promise<Student[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const students = JSON.parse(fileContent);
    // Dates are stored as strings in JSON, so we need to convert them back to Date objects
    return students.map((student: any) => ({
      ...student,
      dateOfBirth: new Date(student.dateOfBirth),
      admissionDate: new Date(student.admissionDate),
      dateOfLeaving: student.dateOfLeaving ? new Date(student.dateOfLeaving) : null,
    }));
  } catch (error) {
    console.error('Could not read students.json:', error);
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

// Helper function to write students to the JSON file
export async function writeStudents(students: Student[]): Promise<void> {
  try {
    const data = JSON.stringify(students, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Could not write to students.json:', error);
  }
}
